package net.retorx.jai

import java.io.File
import java.awt.image.renderable.ParameterBlock
import java.awt.color.ColorSpace
import java.awt.image.{BufferedImage, BufferedImageFilter, ColorConvertOp}
import java.awt.{GraphicsDevice, GraphicsEnvironment, RenderingHints}
import javax.media.jai.operator.ScaleDescriptor
import javax.media.jai.{BorderExtender, InterpolationBicubic, JAI}
import java.util.Random
import javax.imageio.ImageIO

import com.google.inject.{Inject, Singleton}

@Singleton
class ImageUtil {
	val random = new Random(System.currentTimeMillis())

	def resizeImage(renderedImage: BufferedImage, width: Int, height: Int) = {
		val hints = 0
		val thumbnail = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
		val graphics2d = thumbnail.createGraphics
		graphics2d.drawImage(renderedImage, 0, 0, width, height, null)
		graphics2d.dispose()

		thumbnail
	}

	def randomCrop(fullSizeBufferedImage: BufferedImage) = {
		val width = fullSizeBufferedImage.getData.getWidth
		val height = fullSizeBufferedImage.getData.getHeight
		val x = random.nextInt(width - 100)
		val y = random.nextInt(height - 100)

		val pb = new ParameterBlock()
		pb.addSource(fullSizeBufferedImage)

		pb.add(x.toFloat)
		pb.add(y.toFloat)
		pb.add(100.toFloat)
		pb.add(100.toFloat)

		val renderedOp = JAI.create("crop", pb)
		renderedOp.getRendering.getAsBufferedImage
	}

	def resizeConstrainedScaledImage(renderedImage: BufferedImage, maxWidth: Int, maxHeight: Int) = {
		val originalWidth = renderedImage.getWidth
		val originalHeight = renderedImage.getHeight

		val widthFactor = maxWidth.toFloat / originalWidth.toFloat
		val heightFactor = maxHeight.toFloat / originalHeight.toFloat

		val widthExceeds = originalWidth > maxWidth
		val heightExceeds = originalHeight > maxHeight

		val scaleFactor = calculateScaleFactor(widthFactor, heightFactor)
		if (scaleFactor > 0 && scaleFactor != 1) {
			scale(renderedImage, scaleFactor)
		} else {
			renderedImage
		}
	}

	private def scale(image: BufferedImage, scale: Float): BufferedImage = {
		val hints = new RenderingHints(JAI.KEY_BORDER_EXTENDER, BorderExtender.createInstance(BorderExtender.BORDER_COPY))
		val op = ScaleDescriptor.create(image, scale, scale, 0.toFloat, 0.toFloat, new InterpolationBicubic(0xf), hints)
		val scaledImage = op.getAsBufferedImage

		scaledImage
	}

	private def calculateScaleFactor(widthFactor: Float, heightFactor: Float): Float = {
		if (widthFactor > 0 && heightFactor > 0) {
			if (widthFactor < heightFactor) {
				widthFactor
			} else {
				heightFactor
			}
		} else if ((widthFactor > 0) != (heightFactor > 0)) {
			if (widthFactor < heightFactor) {
				heightFactor
			} else {
				widthFactor
			}
		} else {
			0.toFloat
		}
	}

	private def createFuckingGraphicsEnv() = {
		val ge = GraphicsEnvironment.getLocalGraphicsEnvironment
		val gd = ge.getDefaultScreenDevice
		gd.getDefaultConfiguration
	}

	def savePNGImageFile(file: File, image: BufferedImage) = {
		ImageIO.write(image, "png", file)
	}

	def desaturateImage(renderedImage: BufferedImage) = {
		val grayscaleOp = new ColorConvertOp(ColorSpace.getInstance(ColorSpace.CS_GRAY), new RenderingHints(new java.util.HashMap()))
		grayscaleOp.filter(renderedImage, null) // null creates a new image :-/
	}

	def createBufferedImage(file: File) = {
		try {
			ImageIO.read(file)
		} catch {
			case e: Exception =>
				throw new IllegalArgumentException("Could not create a buffered image for file " + file, e)
		}
	}

	def isImageFile(file: File) = {
		val name = file.getName
		name.endsWith("png") || name.endsWith("jpg")
	}

}