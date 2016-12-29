package net.retorx

import javax.ws.rs._
import com.google.inject.{Singleton, Inject}
import org.jboss.resteasy.annotations.cache.{NoCache, Cache}
import net.retorx.images.ImageContentDAO

@Singleton
@Path("/images")
class ImageContentService @Inject() (imageContentDAO:ImageContentDAO) {

    @NoCache
	@GET
	@Path("/tags")
	@Produces(Array("text/json"))
	def getTags = {
		imageContentDAO.getTags
	}

    @NoCache
	@GET
	@Path("/tag/{tag}")
	@Produces(Array("text/json"))
	def getImagesForTag(@PathParam("tag") tag : String) = {
		imageContentDAO.getImageContentByTag(tag)
	}

    @NoCache
    @GET
    @Path("/tag/{tag}/image")
    @Produces(Array{"image/png"})
    def getTagImage(@PathParam("tag") tag: String) = {
        imageContentDAO.getRandomImageContentForTag(tag)
    }

    @NoCache
    @GET
    @Path("/latest")
    @Produces(Array("text/json"))
    def getLatestImages = {
        imageContentDAO.getLatestImages
    }

    @NoCache
	@GET
	@Path("/all")
	@Produces(Array("text/json"))
	def getAllImageContent = {
		imageContentDAO.getAllImageContent
	}

    @Cache(maxAge = 3600)
	@GET
	@Path("/data/{id}")
	@Produces(Array("text/json"))
	def getImageContent(@PathParam("id") id: String) = {
		imageContentDAO.getImageContent(id)
	}

    @Cache(maxAge = 3600, isPrivate = false)
    @GET
    @Path("/image/{version}/{id}.png")
    @Produces(Array{"image/png"})
    def getImageFileByName(@PathParam("id") id: String, @PathParam("version") version: String) = {
        val imageContent = getImageContent(id)
        imageContent.getImageFileByVersion(version) match {
            case Some(imageFile) => imageFile.file
            case None => None
        }
    }

	private def pause() {
		try {
			Thread.sleep(10000)
		} catch {
			case e: Exception => e.printStackTrace()
		}
	}
}
