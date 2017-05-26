package net.retorx.web

import javax.ws.rs._

import com.google.inject.{Inject, Singleton}
import net.retorx.images.{ImageContentDAO, ImagesDirectoryManager}
import net.retorx.config.SiteContentService
import org.jboss.resteasy.spi.NotFoundException
import org.jboss.resteasy.plugins.providers.multipart.{InputPart, MultipartFormDataInput}
import org.apache.commons.io.IOUtils
import java.io.{File, FileOutputStream, InputStream}

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper
import org.jboss.resteasy.annotations.cache.NoCache
import org.jboss.resteasy.annotations.providers.multipart.PartType

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
	@Path("/image/{name}/properties")
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
	@Path("/image/{name}")
	@Consumes(Array("multipart/form-data"))
	def replaceImageFile(@PathParam("name") name: String,
						 formDataInput: MultipartFormDataInput) = {
		withImageContent(name) { imageContent =>
			imageContent.getImageFileByVersion("original") match {
				case Some(imageFile) =>

					import scala.collection.JavaConverters._
					val formDataMap = formDataInput.getFormDataMap.asScala
					val propertiesInputPart = formDataMap("properties").get(0)

					val mapper = new ObjectMapper() with ScalaObjectMapper
					mapper.registerModule(DefaultScalaModule)
					val properties = mapper.readValue(propertiesInputPart.getBodyAsString, classOf[Map[String, String]])
					imageContent.setProperties(properties)
					imageContent.savePropertiesFile()

					formDataMap.get("image") match {
						case Some(imageInputParts) =>
							val imageInputPart = imageInputParts.get(0)
							val inputStream = imageInputPart.getBody(classOf[InputStream], null)
							IOUtils.copy(inputStream, new FileOutputStream(imageFile.file))
							imageContentDAO.replaceOriginalImage(imageContent)
						case None =>
					}
					imageContentDAO.reloadFromFiles()
					successJson
				case None =>
					throw new NotFoundException("Somehow don't have an original file.")

			}
		}
	}

	@POST
	@Path("/image/{name}")
	@Consumes(Array("multipart/form-data"))
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