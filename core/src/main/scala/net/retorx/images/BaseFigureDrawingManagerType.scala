package net.retorx.images

import java.io.File
import net.retorx.util.FileUtil

abstract class BaseFigureDrawingManagerType[T <: ImageContentData]() extends ManagerType {

	override def buildImageContent(file: File) = {
		if (file.isDirectory) {
			val imageContent = addMultipleImageContentDirectory(file)
			println("Added existing ImageContent " + imageContent + " based on image content dir " + file.getAbsolutePath)
			Some(imageContent)
		} else {
			println("Ignoring unknown file/directory " + file.getAbsolutePath)
			None
		}
	}

	def handleOriginalFile(originalFile: File): T

	def handleAltImageFile(imageFile: File, imageContentData: T)

	private def addMultipleImageContentDirectory(directory: File) = {
		val originalFile = pickOriginalFileFromDirectory(directory)
		val imageContentData = handleOriginalFile(originalFile)

		val filter = (file: File) => {
			val isProcessedImage = imageContentData.containsProcessedImage(file)
			val result = !file.equals(originalFile) && FileUtil.isImage(file) && !isProcessedImage
			result
		}

		directory.listFiles
			.filter(filter)
			.foreach(imageFile => {
			handleAltImageFile(imageFile, imageContentData)
		})

		imageContentData.newImageContent()
	}

	private def pickOriginalFileFromDirectory(directory: File) = {
		directory.listFiles.find(file => FileUtil.isImage(file)) match {
			case Some(originalImage) => originalImage
			case None => throw new IllegalStateException("No original image found in directory " + directory)
		}
	}
}