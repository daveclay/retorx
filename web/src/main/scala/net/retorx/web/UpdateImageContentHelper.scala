package net.retorx.web

import java.io.{FileOutputStream, InputStream}
import javax.ws.rs.NotFoundException

import com.google.inject.{Inject, Singleton}
import net.retorx.ImageContent
import net.retorx.images.ImageContentDAO
import org.apache.commons.io.IOUtils

@Singleton
class UpdateImageContentHelper @Inject() (imageContentDAO: ImageContentDAO) {

	def imageUpdater() = {
		(imageContent: ImageContent,
		 properties: Map[String, String],
		 inputStreamOption: Option[InputStream]) => {
			inputStreamOption match {
				case Some(inputStream) =>
					replaceFile(imageContent, inputStream)
				case None =>
			}
			imageContent.setProperties(properties)
			imageContent.savePropertiesFile()
		}
	}

	private def replaceFile(imageContent: ImageContent, inputStream: InputStream): Unit = {
		imageContent.getImageFileByVersion("original") match {
			case Some(imageFile) =>
				println(s"replacing original image file for ${imageContent.getName}")
				IOUtils.copy(inputStream, new FileOutputStream(imageFile.file))
				imageContentDAO.replaceOriginalImage(imageContent)
			case None =>
				throw new NotFoundException("Not implemented: no original file found. That ain't good. Ask daveclay to make that work.")
		}

	}

}
