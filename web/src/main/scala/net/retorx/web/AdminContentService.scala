package net.retorx.web

import javax.ws.rs._

import com.google.inject.{Inject, Singleton}
import net.retorx.images.{ImageContentDAO, ImagesDirectoryManager}
import net.retorx.config.SiteContentService
import org.jboss.resteasy.spi.NotFoundException
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput
import org.apache.commons.io.IOUtils
import java.io.{File, FileOutputStream}

import org.jboss.resteasy.annotations.cache.NoCache

@Path("/admin")
@Singleton
class AdminContentService @Inject()(val imageContentDAO: ImageContentDAO,
									imagesDirectoryManager: ImagesDirectoryManager,
									siteContentService: SiteContentService) extends ContentService {

	val multipartHandler = new MultipartHandler()

	def successJson = """{"success":true}"""

	@NoCache
	@GET
	@Path("/tags")
	@Produces(Array("text/json"))
	def getTags = {
		imageContentDAO.getTags
	}

	@POST
	@Path("/css")
	@Consumes(Array("text/css", "text/plain"))
	@Produces(Array("application/json"))
	def saveCSS(css: String) = {
		siteContentService.saveCSS(css)
	}

	@POST
	@Path("rename/{tag}")
	@Consumes(Array("text/json", "application/json", "application/vnd.imageContent+json"))
	@Produces(Array("text/json"))
	def renameTag(@PathParam("tag") existingTag: String, newTag: String) = {
		imageContentDAO.renameTag(existingTag.trim(), newTag.trim())
		successJson
	}

	@POST
	@Path("{name}/properties")
	@Consumes(Array("text/json", "application/json", "application/vnd.imageContent+json"))
	@Produces(Array("application/vnd.imageContent+json"))
	def saveProperties(@PathParam("name") name: String, properties: java.util.Map[String, String]) = {
		withImageContent(name) { imageContent =>
			val wrapped = scala.collection.JavaConversions.mapAsScalaMap(properties)
			imageContent.setProperties(wrapped.toMap)
			imageContent.savePropertiesFile()
			// a little overzealous, but whatever - how long does it take to determine whether tags have changed vs
			// just reloading the damned tags?
			imageContentDAO.reloadTags()
			imageContent
		}
	}

	@DELETE
	@Path("/image/{name}.png")
	def deleteImageFile(@PathParam("name") name: String) = {
		withImageContent(name) { imageContent =>
			imageContent.getImageFileByVersion(name) match {
				case Some(imageFile) =>
					imageContentDAO.deleteImageFileForImage(imageContent, imageFile)
					successJson
				case None =>
					throw new NotFoundException("image file " + name + " does not exist")
			}
		}
	}

	@PUT
	@Path("/image/{name}.png")
	@Consumes(Array("image/png"))
	def replaceImageFile(@PathParam("name") name: String,
						 input: MultipartFormDataInput) = {
		withImageContent(name) { imageContent =>
			imageContent.getImageFileByVersion(name) match {
				case Some(imageFile) =>
					multipartHandler.handleMultipartData(input, (filename, inputStream) => {
						val file = imageFile.file
						val originalModifiedDate = file.lastModified()
						IOUtils.copy(inputStream, new FileOutputStream(file))
						// TODO: re-create thumbnails and size properties. But, meh, who cares.
						imageContentDAO.replaceOriginalImage(imageContent)
						file.setLastModified(originalModifiedDate)
					})
				case None =>
					throw new NotFoundException("image file " + name + " does not exist")
			}
		}
	}

	@POST
	@Path("/image/{name}")
	def addImageFile(@PathParam("name") name: String,
					 input: MultipartFormDataInput) = {
		imageContentDAO.getImageContent(name) match {
			case Some(imageContent) => throw new IllegalStateException("image file " + name + " already exists")
			case None =>
				multipartHandler.handleMultipartData(input, (filenameOption, inputStream) => {
					val properties = Map("name" -> "test")
					imagesDirectoryManager.addImage(name, properties, inputStream)
					imageContentDAO.reloadFromFiles()
				})
		}
	}

	@GET
	@Path("/reloadTags")
	def reloadTags() = {
		imageContentDAO.reloadTags()
		successJson
	}

	@GET
	@Path("/reloadFromFiles")
	def reloadFromFiles() = {
		imageContentDAO.reloadFromFiles()
		successJson
	}

	@POST
	@Path("/tag/image/{tag}")
	@Produces(Array {
		"text/json"
	})
	def createTagImage(@PathParam("tag") tag: String) = {
		imageContentDAO.createTagImage(tag)
	}

	@POST
	@Path("/tag/randomImage/{tag}")
	@Produces(Array {
		"text/json"
	})
	def createRandomTagImage(@PathParam("tag") tag: String) = {
		imageContentDAO.createTagImage(tag)
	}
}