package net.retorx.web

import javax.ws.rs._
import com.google.inject.{Inject, Singleton}
import net.retorx.images.ImageContentDAO
import net.retorx.config.SiteContentService
import org.jboss.resteasy.spi.NotFoundException
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput
import org.apache.commons.io.IOUtils
import java.io.{File, FileOutputStream}

@Path("/admin")
@Singleton
class AdminContentService @Inject()(imageContentDAO: ImageContentDAO,
									siteContentService: SiteContentService) {

	val multipartHandler = new MultipartHandler()

	def successJson = """{"success":true}"""

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
	@Path("{id}/properties")
	@Consumes(Array("text/json", "application/json", "application/vnd.imageContent+json"))
	@Produces(Array("application/vnd.imageContent+json"))
	def saveProperties(@PathParam("id") id: String, properties: java.util.Map[String, String]) = {
		val imageContent = imageContentDAO.getImageContent(id)
		val wrapped = scala.collection.JavaConversions.mapAsScalaMap(properties)
		imageContent.setProperties(wrapped.toMap)
		imageContent.savePropertiesFile()
		// a little overzealous, but whatever - how long does it take to determine whether tags have changed vs
		// just reloading the damned tags?
		imageContentDAO.reloadTags()
		successJson
	}

	@DELETE
	@Path("/image/{id}/{name}.png")
	def deleteImageFile(@PathParam("id") id: String, @PathParam("name") name: String) = {
		val imageContent = imageContentDAO.getImageContent(id)
		imageContent.getImageFileByVersion(name) match {
			case Some(imageFile) =>
				imageContentDAO.deleteImageFileForImage(imageContent, imageFile)
				successJson
			case None =>
				throw new NotFoundException("image file " + name + " does not exist")
		}
	}

	@PUT
	@Path("/image/{id}/{name}.png")
	def replaceImageFile(@PathParam("id") id: String,
						 @PathParam("name") name: String,
						 input: MultipartFormDataInput) = {
		val imageContent = imageContentDAO.getImageContent(id)
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