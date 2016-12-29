package net.retorx.images

import com.google.inject.{Inject, Singleton}
import net.retorx.jai.ImageUtil
import net.retorx.images.processors.{BufferedImageContentData, ImageFileBuilderLookup}
import java.io.File
import net.retorx.ImageContent

@Singleton
class FigureDrawingManagerType @Inject()(imageUtil: ImageUtil,
										 imageFileBuilderLookup: ImageFileBuilderLookup)
	extends BaseFigureDrawingManagerType[BufferedImageContentData] {


	override def reprocessImagesFromOriginal(imageContent: ImageContent) {
		throw new UnsupportedOperationException("Not implemented")
	}

	def handleOriginalFile(originalFile: File): BufferedImageContentData = {
		val imageContentData = new BufferedImageContentData(originalFile)
		imageFileBuilderLookup.addImageFileForFigureDrawingImage(imageContentData)
		imageContentData
	}

	def handleAltImageFile(imageFile: File, imageContentData: BufferedImageContentData) {
		imageFileBuilderLookup.addImageFilesForAlternateViewFigureDrawing(imageFile, imageContentData)
	}
}