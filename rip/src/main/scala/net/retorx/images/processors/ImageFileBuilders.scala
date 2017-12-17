package net.retorx.images.processors

import com.google.inject.Singleton
import net.retorx.jai.ImageUtil
import java.awt.image.BufferedImage
import collection.mutable
import java.io.File
import net.retorx.util.FileUtil
import net.retorx.images.{OriginalFileLocator, ProcessedFileLocator, ProcessedOriginalFileLocator, ImageFileLocator}

trait ImageFileBuilderConfig {
	val imageFileName: String

	def createBuilder: ImageFileBuilder

	val fileUtil = new FileUtil
	val imageUtil = new ImageUtil
}

trait ImageFileBuilderConfigTemplate extends ImageFileBuilderConfig {
	val imageType = imageFileName
	val createBufferedImage: (BufferedImageContentData => BufferedImage)

	def processedFileLocator: ImageFileLocator = new ProcessedOriginalFileLocator(fileUtil, imageFileName)

	override def createBuilder = new ImageFileBuilder(imageFileName, imageType, createBufferedImage, imageUtil, processedFileLocator)
}

/**
 * Takes an existing image file and looks up its image properties, adds them to the main ImageContentData. Does
 * not do any processing into a new image file.
 */
class AltImageFileBuilderConfig(file: File) extends UnprocessedImageFileBuilderConfig(file) {
	override val createBuilder = new ImageFileBuilder(imageFileName, "alt", createBufferedImage, imageUtil, filenameFileLocator)
}

/**
 * Takes an existing image file and looks up its image properties, adds them to the main ImageContentData. Does
 * not do any processing of the given image or the "original" main image into a new image file.
 */
class UnprocessedImageFileBuilderConfig(file: File) extends ImageFileBuilderConfig {

	val imageFileName = FileUtil.getNameWithoutExtensionFromFile(file)
	val createBufferedImage = (data: BufferedImageContentData) => {
		imageUtil.createBufferedImage(file)
	}

	val filenameFileLocator = new ImageFileLocator {
		def getProcessedImageFile(originalFile: File) = {
			file
		}
	}

	override val createBuilder = new ImageFileBuilder(imageFileName, imageFileName, createBufferedImage, imageUtil, filenameFileLocator)
}

class OriginalImageFileBuilderConfig extends ImageFileBuilderConfigTemplate {

	override val imageFileName = "original"
	override val createBufferedImage = (data: BufferedImageContentData) => {
		imageUtil.createBufferedImage(data.getOriginalFile)
	}
	override val processedFileLocator = new OriginalFileLocator()
}

class DesaturatedThumbnailImageFileBuilderBuilderConfig(imageFileBuilderConfigLookup: ImageFileBuilderLookup) extends ImageFileBuilderConfigTemplate {

	val width = 100
	val height = 100
	val thumbnailBuilder = imageFileBuilderConfigLookup.getBuilderByName("thumbnail")

	override val imageFileName = "desaturatedThumbnail"
	override val createBufferedImage = (data: BufferedImageContentData) => {
		thumbnailBuilder.withBufferedImage(data, thumbnailImage => {
			imageUtil.desaturateImage(thumbnailImage)
		})
	}
}

class AltScaledImageFileBuilderConfig(file: File, altImageFileBuilder: ImageFileBuilder) extends ImageFileBuilderConfigTemplate {

	override val imageFileName = FileUtil.getNameWithoutExtensionFromFile(file) + "-scaled"
	override val imageType = "alt-scaled"
	override val processedFileLocator = new ProcessedFileLocator(file, "-scaled")
	override val createBufferedImage = (data: BufferedImageContentData) => {
		altImageFileBuilder.withBufferedImage(data, bufferedImage => {
			imageUtil.resizeConstrainedScaledImage(bufferedImage, ScaledDefaults.defaultMaxWidth, ScaledDefaults.defaultMaxHeight)
		})
	}
}

object ScaledDefaults {
	val defaultMaxWidth = 1000
	val defaultMaxHeight = 1000
	val defaultImageFileName = "scaled"
}

class ScaledImageFileBuilderConfig(maxWidth: Int,
								   maxHeight: Int,
								   aImageFileName: String,
								   imageFileBuilderConfigLookup: ImageFileBuilderLookup) extends ImageFileBuilderConfigTemplate {

	def this(imageFileName: String, imageFileBuilderConfigLookup: ImageFileBuilderLookup) {
		this(ScaledDefaults.defaultMaxWidth, ScaledDefaults.defaultMaxHeight, imageFileName, imageFileBuilderConfigLookup)
	}

	def this(imageFileBuilderConfigLookup: ImageFileBuilderLookup) {
		this(ScaledDefaults.defaultMaxWidth, ScaledDefaults.defaultMaxHeight, ScaledDefaults.defaultImageFileName, imageFileBuilderConfigLookup)
	}

	val originalImageBuilder = imageFileBuilderConfigLookup.getBuilderByName("original")

	override val imageFileName = aImageFileName
	override val createBufferedImage = (data: BufferedImageContentData) => {
		originalImageBuilder.withBufferedImage(data, fullSizeBufferedImage => {
			imageUtil.resizeConstrainedScaledImage(fullSizeBufferedImage, maxWidth, maxHeight)
		})
	}
}

class ThumbnailImageFileBuilderBuilderConfig(imageFileBuilderConfigLookup: ImageFileBuilderLookup) extends ImageFileBuilderConfigTemplate {

	val width = 200
	val height = 200
	val originalImageBuilder = imageFileBuilderConfigLookup.getBuilderByName("original")

	override val imageFileName = "thumbnail"
	override val createBufferedImage = (data: BufferedImageContentData) => {
		originalImageBuilder.withBufferedImage(data, originalBufferedImage => {
			//imageUtil.resizeImage(originalBufferedImage, width, height)
			imageUtil.resizeConstrainedScaledImage(originalBufferedImage, width, height)
		})
	}
}

class RandomCropImageFileBuilderBuilderConfig(imageFileBuilderConfigLookup: ImageFileBuilderLookup) extends ImageFileBuilderConfigTemplate {

	val originalImageBuilder = imageFileBuilderConfigLookup.getBuilderByName("original")

	override val imageFileName = "randomCrop"
	override val createBufferedImage = (data: BufferedImageContentData) => {
		originalImageBuilder.withBufferedImage(data, bufferedImage => {
			imageUtil.randomCrop(bufferedImage)
		})
	}
}

@Singleton
class ImageFileBuilderLookup {

	val buildersByName = mutable.HashMap[String, ImageFileBuilder]()
	val buildersByClass = mutable.HashMap[String, ImageFileBuilder]()
	val retorxImageProcessorNames = Array(
		"original",
		"scaled",
		"thumbnail")
		//"desaturatedThumbnail")

	val figureDrawingImageProcessorNames = Array(
		"original",
		"scaled",
		"thumbnail")

	addConfig(new OriginalImageFileBuilderConfig())
	addConfig(new ThumbnailImageFileBuilderBuilderConfig(this))
	addConfig(new DesaturatedThumbnailImageFileBuilderBuilderConfig(this))
	addConfig(new RandomCropImageFileBuilderBuilderConfig(this))
	addConfig(new ScaledImageFileBuilderConfig(this))

	private def addConfig(config: ImageFileBuilderConfig) {
		val builder = config.createBuilder
		buildersByName += (config.imageFileName -> builder)
		buildersByClass += (config.getClass.getName -> builder)
	}

	def build(builderNames: Array[String],
			  imageContentData: BufferedImageContentData,
			  rebuildProcessedFiles: Boolean = false) {
		builderNames.foreach(name =>
			try {
				val builder = getBuilderByName(name)
				builder.process(imageContentData, rebuildProcessedFiles)
			} catch {
				case e: Exception => e.printStackTrace()
			})
	}

	def build(builderConfigs: Array[ImageFileBuilderConfig], imageContentData: BufferedImageContentData) {
		val builders = builderConfigs.map(builderConfig => builderConfig.createBuilder)
		build(builders, imageContentData)
	}

	def build(builders: Array[ImageFileBuilder], imageContentData: BufferedImageContentData) {
		builders.foreach(builder => builder.process(imageContentData))
	}

	def addImageFilesForAlternateViewFigureDrawing(alternateImageFile: File, imageContentData: BufferedImageContentData) {
		val altBuilder = new UnprocessedImageFileBuilderConfig(alternateImageFile).createBuilder
		val scaledAltBuilder = new AltScaledImageFileBuilderConfig(alternateImageFile, altBuilder).createBuilder
		build(Array(altBuilder, scaledAltBuilder), imageContentData)
	}

	def addImageFileForFigureDrawingImage(imageContentData: BufferedImageContentData) {
		build(figureDrawingImageProcessorNames, imageContentData)
	}

	def reprocessImagesFromFile(imageContentData: BufferedImageContentData) {
		build(retorxImageProcessorNames, imageContentData, rebuildProcessedFiles = true)
	}

	def addImageFilesForRetorxImage(imageContentData: BufferedImageContentData) {
		build(retorxImageProcessorNames, imageContentData)
	}

	def getBuilderByClass[T <: ImageFileBuilderConfig](clazz: Class[T]): ImageFileBuilder = {
		buildersByClass(clazz.getName)
	}

	def getBuilderByName(name: String): ImageFileBuilder = {
		buildersByName(name)
	}
}

