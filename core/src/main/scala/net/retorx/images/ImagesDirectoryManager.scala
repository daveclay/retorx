package net.retorx.images

import com.google.inject.name.Named
import java.io.File
import java.util

import com.google.inject.{Inject, Singleton}
import org.apache.commons.io.FileUtils
import net.retorx.{ImageContent, ImageFile}

@Singleton
class ImagesDirectoryManager @Inject()(@Named("content.dir") contentDir: File,
									   managerType: ManagerType) {
	val imagesDir = new File(contentDir, "images")

	def reprocessImagesFromOriginal(imageContent: ImageContent) {
		managerType.reprocessImagesFromOriginal(imageContent)
	}

	def loadImagesFromDisk(callback: (ImageContent) => Unit) {
		if (!imagesDir.exists) {
			imagesDir.mkdirs()
		}

		val files = imagesDir.listFiles()
		val total = files.size
		files.par.foreach { file  =>
			try {
				managerType.buildImageContent(file) match {
					case Some(imageContent) => callback(imageContent)
					case None =>
				}
			} catch {
				case e: Exception => e.printStackTrace()
			}
		}
	}

	def getDefaultTags: Array[String] = {
		getTagFile match {
			case Some(file) => FileUtils.readFileToString(file).split(",").map { s => s.trim() }
			case None => Array()
		}
	}

	def deleteImageFile(imageFile: ImageFile) {
		val file = imageFile.file
		file.delete()
	}

	def renameTag(existingTag: String, newTag: String) = {
		val tags = getDefaultTags
		val save = (updatedTags: Array[String]) => {
			getTagFile match {
				case Some(file) =>
					FileUtils.write(file, updatedTags.mkString(","))
				case None =>
					throw new IllegalStateException(s"No tags file in ${contentDir.getAbsolutePath}")
			}
		}
		val index = getDefaultTags.indexOf(existingTag)
		if (index < 0) {
			save(tags :+ newTag)
		} else {
			tags.update(index, newTag)
			save(tags)
		}
	}

	private def getTagFile = {
		try {
			contentDir.listFiles.find { file => file.getName.equals("tags") }
		} catch {
			case e: Exception =>
				System.err.println(f"Couldn't load tags from ${contentDir.getAbsolutePath}")
				throw e
		}
	}

}

trait ManagerType {
	def reprocessImagesFromOriginal(imageContent: ImageContent)

	def buildImageContent(file: File): Option[ImageContent]
}

