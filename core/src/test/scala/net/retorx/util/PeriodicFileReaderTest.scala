package net.retorx.util

import java.io.File

import org.junit.runner.RunWith
import org.specs2.runner.JUnitRunner
import org.specs2.mock.Mockito
import org.specs2.mutable._
import org.specs2.matcher._

@RunWith(classOf[JUnitRunner])
class PeriodicFileReaderTest extends Specification with Mockito {
	isolated

    val file = mock[File]
    val handler = mock[File => Unit]
    val periodicFileReader = new PeriodicFileReader(file, handler)

    "The PeriodicFileReader" should {
		"read a file when it is opened" in {
			periodicFileReader.open()

			there was one(handler).apply(file)
		}

		"read the file again when the last modified changes" in {
			file.lastModified() returns 1000
			periodicFileReader.open()

			file.lastModified() returns 2000

			periodicFileReader.checkFile()
			there was two(handler).apply(file)
		}

		"not read the file if the modified date has not changed" in {
			file.lastModified() returns 1000
			periodicFileReader.open()

			periodicFileReader.checkFile()
			there was one(handler).apply(file)
		}
	}
}



