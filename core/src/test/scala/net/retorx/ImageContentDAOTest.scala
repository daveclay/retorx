package net.retorx

import org.mockito.Mockito._

import scala.collection.mutable
import java.io.File
import java.util.Date

import net.retorx.images.{ImageContentDAO, ImageContentLibrary, ImagesDirectoryManager}
import org.junit.runner.RunWith
import org.specs2.mock.Mockito
import org.specs2.mutable._
import org.specs2.matcher._
import org.specs2.runner.JUnitRunner

@RunWith(classOf[JUnitRunner])
class ImageContentDAOTest extends Specification with Mockito {
    trait MockImages extends Scope {
    }
}



