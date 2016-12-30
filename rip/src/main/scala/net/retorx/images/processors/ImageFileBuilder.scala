package net.retorx.images.processors

import java.awt.image.BufferedImage
import net.retorx.jai.ImageUtil
import java.io.File
import net.retorx.ImageFile
import net.retorx.images.ImageFileLocator

class ImageFileBuilder(processedImageFileName: String,
					   imageType: String,
					   createBufferedImage: (BufferedImageContentData) => BufferedImage,
					   imageUtil: ImageUtil,
					   processedFileLocator: ImageFileLocator) {

	if (createBufferedImage == null) {
		throw new IllegalArgumentException("createBufferedImage was null, that's not what you want.")
	}

	def process(imageContentData: BufferedImageContentData, rebuildProcessedFiles: Boolean = false) {

		val originalImageFile = imageContentData.getOriginalFile
		val processedFile = processedFileLocator.getProcessedImageFile(originalImageFile)

		def handleFile(processedFile: File): (Int, Int) = {
			processedFile.exists() && !rebuildProcessedFiles match {
				case true => getDimensionsFromFile
				case false =>
					withBufferedImage(imageContentData, bufferedImage => {
						saveImage(bufferedImage)
					})
			}
		}

		def getDimensionsFromFile: (Int, Int) = {
			imageContentData.getImageFileDimensionsFromProperties(processedImageFileName) match {
				case None =>
					withBufferedImage(imageContentData, bufferedImage => {
						getImageDimensions(processedFile, bufferedImage)
					})
				case Some((width, height)) => (width, height)
			}
		}

		def saveImage(bufferedImage: BufferedImage) = {
			imageUtil.savePNGImageFile(processedFile, bufferedImage)
			getImageDimensions(processedFile, bufferedImage)
		}

		def getImageDimensions(file: File,
							   bufferedImage: BufferedImage) = {
			val width = bufferedImage.getWidth
			val height = bufferedImage.getHeight
			(width, height)
		}

		val (width, height) = handleFile(processedFile)

		val imageFile = ImageFile(processedImageFileName, width, height, imageType, processedFile)
		imageContentData.addImageFile(processedImageFileName, imageFile)
	}

	/**
	 *
	 * @param imageContentData
	 * @param f
	 * @tparam T
	 * @return
	 */
	def withBufferedImage[T](imageContentData: BufferedImageContentData, f: (BufferedImage => T)) = {
		imageContentData.getBufferedImage(processedImageFileName) match {
			case Some(bufferedImage) => f(bufferedImage)
			case None =>
				println("Creating " + processedImageFileName + " for " + imageContentData.getOriginalFile.getName)
				val bufferedImage = createBufferedImage(imageContentData)
				imageContentData.addBufferedImage(processedImageFileName, bufferedImage)
				f(bufferedImage)
		}
	}
}

