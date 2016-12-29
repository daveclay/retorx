package net.retorx

import org.mockito.Mockito._

import scala.collection.mutable
import java.io.File
import java.util.Date

import net.retorx.images.{ImageContentDAO, ImageData, ImagesDirectoryManager}
import org.junit.runner.RunWith
import org.specs2.mock.Mockito
import org.specs2.mutable._
import org.specs2.matcher._
import org.specs2.runner.JUnitRunner

@RunWith(classOf[JUnitRunner])
class ImageContentDAOTest extends Specification with Mockito {

    val image1Properties = Map("tags" -> "abstract, figure")
    val image1 = newImageContent("image1", image1Properties)

    val image2Properties = Map("tags" -> "abstract, figure")
    val image2 = newImageContent("image2", image2Properties)

    val image3Properties = Map("tags" -> "abstract")
    val image3 = newImageContent("image3", image3Properties)

    val imagesDirectoryManager = mock[ImagesDirectoryManager]
    val imageData = new ImageData(imagesDirectoryManager)

    "ImageContentDAO" should {
		"return the list of images for a tag" in new MockImages {
			val expected = new mutable.TreeSet[ImageContent]()
			expected += image1
			expected += image2

			val figureImages = imageContentDao.getImageContentByTag("figure")
			figureImages should beEqualTo (expected)
		}
	}

    "ImageContentDAO" should {
		"update the set of images for tag when the image's tag changes" in new MockImages {
			val newImage1 = newImageContent("image1", Map("tags" -> "abstract"))

			imageContentDao.reloadTags()
			imageContentDao.addImageContent(newImage1)
			imageContentDao.addImageContent(image2)
			imageContentDao.addImageContent(image3)

			val figureImages = imageContentDao.getImageContentByTag("figure")

			val expected = new mutable.TreeSet[ImageContent]()
			expected += image2

			figureImages should beEqualTo (expected)
		}
	}

    trait MockImages extends Scope {
        when(imagesDirectoryManager.getDefaultTags).thenReturn(Array[String]())

        val imageContentDao = new ImageContentDAO(imageData)

        imageContentDao.addImageContent(image1)
        imageContentDao.addImageContent(image2)
        imageContentDao.addImageContent(image3)

    }

    def newImageContent(name: String, properties: Map[String, String]) = {
        val imageDirectory = mock[File]
        val imageFiles = Map[String, ImageFile]()
        new ImageContent(name, new Date(), properties, imageDirectory, imageFiles)

    }
}



