package net.retorx.images.processors

import java.io.File
import net.retorx.jai.ImageUtil
import java.awt.image.BufferedImage
import net.retorx.ImageFile
import net.retorx.images.ImageFileLocator
import org.junit.runner.RunWith
import org.specs2.runner.JUnitRunner
import org.specs2.mock.Mockito
import org.specs2.mutable._

@RunWith(classOf[JUnitRunner])
class ImageFileBuilderTest extends Specification with Mockito {
	isolated

	def verifyExpectedImageDataWasAdded() {
		val expected = ImageFile(processedImageFileName, processedBufferedImage.getWidth, processedBufferedImage.getHeight, "original", processedFile)
		there was one (imageContentData).addImageFile(processedImageFileName, expected)
	}

    val imageDirectory = mock[File]
    val originalFile = mock[File]
    val processedFile = mock[File]
    val originalBufferedImage = mock[BufferedImage]
    val imageUtil = mock[ImageUtil]
    val createBufferedImage = mock[BufferedImageContentData => BufferedImage]
    val imageContentData = mock[BufferedImageContentData]
    val processedBufferedImage = mock[BufferedImage]
    val processedFileLocator = mock[ImageFileLocator]
    val processedImageFileName = "test"
    val imageFileBuilder = new ImageFileBuilder(processedImageFileName, "original", createBufferedImage, imageUtil, processedFileLocator)

    imageDirectory.getName returns "someImage"
    originalFile.getName returns "someImage.png"
    originalFile.getParentFile returns imageDirectory
    imageContentData.getOriginalFile returns originalFile
    processedFileLocator.getProcessedImageFile(originalFile) returns processedFile
    imageUtil.createBufferedImage(originalFile) returns originalBufferedImage
    createBufferedImage(imageContentData) returns processedBufferedImage

    originalBufferedImage.getWidth returns 1320
    originalBufferedImage.getHeight returns 1532
    processedBufferedImage.getWidth returns 100
    processedBufferedImage.getHeight returns 100

    "The ImageFileBuilder" should {
		"process an existing buffered image from the callback" in {
			val f = mock[BufferedImage => Unit]
			imageContentData.getBufferedImage(processedImageFileName) returns Some(processedBufferedImage)

			imageFileBuilder.withBufferedImage(imageContentData, f)

			there was one (f).apply(processedBufferedImage)
		}

		"add an existing image file if the file does exist" in {
			processedFile.exists() returns true
			imageContentData.getImageFileDimensionsFromProperties(processedImageFileName) returns Some((100, 100))

			imageFileBuilder.process(imageContentData)

			verifyExpectedImageDataWasAdded()
			there was no(createBufferedImage).apply(imageContentData)
		}

		"determine the image dimensions if the file exists but the properties do not have dimension data" in {
			processedFile.exists() returns true
			imageContentData.getBufferedImage(processedImageFileName) returns None
			imageContentData.getImageFileDimensionsFromProperties(processedImageFileName) returns None

			imageFileBuilder.process(imageContentData)

			verifyExpectedImageDataWasAdded()
			there was one (createBufferedImage).apply(imageContentData)
		}

		"add a new image from a processed BufferedImage if the file does not exist" in {
			imageContentData.getBufferedImage(processedImageFileName) returns Some(processedBufferedImage)
			imageContentData.getImageFileDimensionsFromProperties(processedImageFileName) returns None

			imageFileBuilder.process(imageContentData)

			verifyExpectedImageDataWasAdded()
			there was no (createBufferedImage).apply(imageContentData)
		}
	}
}


