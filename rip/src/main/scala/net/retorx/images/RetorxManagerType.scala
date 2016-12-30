package net.retorx.images

import com.google.inject.{Inject, Singleton}
import net.retorx.jai.ImageUtil
import net.retorx.images.processors.{BufferedImageContentData, ImageFileBuilderLookup}
import java.io.File
import net.retorx.util.FileUtil
import net.retorx.ImageContent

@Singleton
class RetorxManagerType @Inject()(imageUtil: ImageUtil,
								  imageFileBuilderLookup: ImageFileBuilderLookup) extends ManagerType {


	override def reprocessImagesFromOriginal(imageContent: ImageContent) {
		imageContent.getImageFileByVersion("original") match {
			case Some(imageFile) =>
				val imageContentData = new BufferedImageContentData(imageFile.file)
				imageFileBuilderLookup.reprocessImagesFromFile(imageContentData)
			case None => throw new IllegalStateException("Somehow " + imageContent.getName + " does not have an original image.")
		}
	}

	override def buildImageContent(file: File) = {
		if (imageUtil.isImageFile(file)) {
			val imageContent = createNewImageContentDirectoryFromImage(file)
			println("Created new ImageContent " + imageContent + " based on image " + file.getAbsolutePath)
			Some(imageContent)
		} else if (file.isDirectory) {
			val imageContent = addImageContentDirectory(file)
			println("Added existing ImageContent " + imageContent + " based on image content dir " + file.getAbsolutePath)
			Some(imageContent)
		} else {
			println("Ignoring unknown file/directory " + file.getAbsolutePath)
			None
		}
	}

	private def addImageContentDirectory(directory: File) = {
		val imageFile = findOriginalImage(directory)
		val imageContentData = new BufferedImageContentData(imageFile)
		imageFileBuilderLookup.addImageFilesForRetorxImage(imageContentData)

		imageContentData.newImageContent()
	}

	private def findOriginalImage(directory: File) = {
		var imageFile: Option[File] = None

		directory.listFiles.foreach { file =>
			val fileName = FileUtil.getNameWithoutExtensionFromFile(file)
			if (fileName.equals(directory.getName)) {
				imageFile = Some(file)
			}
		}

		imageFile.getOrElse(throw new IllegalArgumentException("Could not find image file in " + directory.getAbsolutePath))
	}

	private def createNewImageContentDirectoryFromImage(file: File) = {
		val name = FileUtil.getNameWithoutExtensionFromFile(file)
		val imageDirectory = new File(file.getParentFile, name)
		imageDirectory.mkdirs
		val fileInContentDirectory = new File(imageDirectory, file.getName)
		file.renameTo(fileInContentDirectory)
		addImageContentDirectory(imageDirectory)
	}

}