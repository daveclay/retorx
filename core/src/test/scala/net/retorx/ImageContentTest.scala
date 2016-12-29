package net.retorx

import java.util.Date
import java.io.File

import org.junit.runner.RunWith
import org.specs2.runner.JUnitRunner
import org.specs2.mock.Mockito
import org.specs2.mutable._
import org.specs2.matcher._

@RunWith(classOf[JUnitRunner])
class ImageContentTest extends Specification with Mockito {
	isolated

    val name = "image"
    val date = new Date()
    val properties = Map("tags" -> "figure,digital collage", "hidden" -> "true")
    val imageDir = mock[File]
    val imageFiles = Map[String, ImageFile]()
    val imageContent = new ImageContent(name, date, properties, imageDir, imageFiles)

    "The ImageContent" should {
		"rename a tag" in {
			imageContent.replaceTag("figure", "figure painting")

			val newTag = imageContent.getTags.find(tag => {
				tag.equals("figure painting")
			})

			newTag should beEqualTo (Some("figure painting"))

			val oldTag = imageContent.getTags.find(tag => {
				tag.equals("figure")
			})

			oldTag should be (None)
		}
	}
}



