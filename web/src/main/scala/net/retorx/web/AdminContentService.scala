package net.retorx.web

import javax.ws.rs._

import com.google.inject.{Inject, Singleton}
import net.retorx.images.{ImageContentDAO, ImagesDirectoryManager}
import net.retorx.config.SiteContentService
import org.jboss.resteasy.spi.NotFoundException
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput
import java.io.InputStream
import javax.ws.rs.core.Response

import org.jboss.resteasy.annotations.cache.NoCache

@Path("/admin")
@Singleton
class AdminContentService @Inject()(val imageContentDAO: ImageContentDAO,
									imagesDirectoryManager: ImagesDirectoryManager,
									siteContentService: SiteContentService,
									updateImageContentHelper: UpdateImageContentHelper) extends ContentService {

	private val uploadImageContentHandler = new UploadImageFormDataHelper()
	private val imageUpdater = updateImageContentHelper.imageUpdater()

	def successJson = """{"success":true}"""

	@NoCache
	@GET
	@Path("/tags")
	@Produces(Array("text/json"))
	def getTags = {
		imageContentDAO.getTags
	}

	@POST
	@Path("rename/{tag}")
	@Consumes(Array("text/json", "application/json", "application/vnd.imageContent+json"))
	@Produces(Array("text/json"))
	def renameTag(@PathParam("tag") existingTag: String, newTag: String) = {
		imageContentDAO.renameTag(existingTag.trim(), newTag.trim())
		successJson
	}

	@DELETE
	@Path("/image/{name}.png")
	@Produces(Array("text/json"))
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
	@Produces(Array("text/json"))
	def updateImageFile(@PathParam("name") name: String,
						formDataInput: MultipartFormDataInput) = {
		try {
			withImageContent(name) { imageContent =>
				val handler = (properties: Map[String, String], inputStreamOption: Option[InputStream]) => {
					println(s"updating image $name")
					imageUpdater(imageContent, properties, inputStreamOption)
				}

				uploadImageContentHandler.handleSaveImageData(formDataInput, handler)
				imageContent
			}
		} catch {
			case err: Exception =>
				err.printStackTrace()
				unprocessableEntity(err.getMessage)

		}
	}

	@POST
	@Path("/image/{name}")
	@Consumes(Array("multipart/form-data"))
	@Produces(Array("text/json"))
	def addImageFile(@PathParam("name") name: String,
					 formDataInput: MultipartFormDataInput) = {
		imageContentDAO.getImageContent(name) match {
			case Some(imageContent) =>
				unprocessableEntity("image file " + name + " already exists")
			case None =>
				uploadImageContentHandler.handleSaveImageData(formDataInput, (properties, inputStreamOption) => {
					println(s"adding new image $name")
					inputStreamOption match {
						case Some(inputStream) =>
							imagesDirectoryManager.addImage(name, properties, inputStream)
						case None =>
							unprocessableEntity("No image file provided")

					}
				})

				successJson
		}
	}

	@POST
	@Path("/reload")
	def reload() = {
		imageContentDAO.reloadFromFiles()
		successJson
	}

	@POST
	@Path("/tag/image/{tag}")
	@Produces(Array("text/json"))
	def createTagImage(@PathParam("tag") tag: String) = {
		imageContentDAO.createTagImage(tag)
	}

	@POST
	@Path("/tag/randomImage/{tag}")
	@Produces(Array("text/json"))
	def createRandomTagImage(@PathParam("tag") tag: String) = {
		imageContentDAO.createTagImage(tag)
	}

	private def unprocessableEntity(message: String) = {
		val response = Response
			.status(422)
			.entity(s"""{ "message": "$message" }""")
			.`type`("application/json")
			.build()
		throw new WebApplicationException(message, response)
	}
}