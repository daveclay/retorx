package net.retorx.images.processors

import java.io.File
import scala.collection.mutable
import java.awt.image.BufferedImage
import net.retorx.images.ImageContentData

class BufferedImageContentData(originalImageFile: File) extends ImageContentData(originalImageFile) {
	private val bufferedImagesByName = mutable.Map[String, BufferedImage]()

	override def newImageContent() = {
		val imageContent = super.newImageContent()
		bufferedImagesByName.clear()
		System.gc()
		imageContent
	}

	def getBufferedImage(name: String) = {
		bufferedImagesByName.get(name)
	}

	def addBufferedImage(name: String, bufferedImage: BufferedImage) {
		bufferedImagesByName.put(name, bufferedImage)
	}
}