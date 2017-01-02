package net.retorx.images

import java.io.{FileInputStream, File}
import scala.collection.immutable.TreeMap
import net.retorx.ImageContent
import net.retorx.util.{PropertiesUtils, FileUtil}
import java.text.SimpleDateFormat
import java.util.{Properties, Date}
import org.apache.commons.io.FileUtils
import scala.collection.convert.WrapAsScala._
import net.retorx.ImageFile

class ImageContentData(originalImageFile: File) {

	private val imageDirectory = originalImageFile.getParentFile

	private val propertiesFile = findPropertiesFile(imageDirectory)
	private var properties = parsePropertiesFile(propertiesFile)
	private var propertiesModified = false

	private val name = findName()
	private val date = findImageDate()

	private var imageFiles = new TreeMap[String, ImageFile]()


	def getOriginalFile = originalImageFile

	def newImageContent() = {
		if (propertiesModified) savePropertiesFile()
		new ImageContent(name, date, properties, imageDirectory, imageFiles)
	}

	def addImageFile(name: String, imageFile: ImageFile) {
		addImageFileProperties(name, imageFile)
		imageFiles = imageFiles + (name -> imageFile)
	}

	private def addImageFileProperties(name: String, imageFile: ImageFile) {
		// TODO: repalce when rebuilding image files
		addProperty(widthKey(name), imageFile.width.toString)
		addProperty(heightKey(name), imageFile.height.toString)
	}

	def containsProcessedImage(file: File) = {
		imageFiles.values.exists(imageFile => imageFile.file.equals(file))
	}

	def getImageFileDimensionsFromProperties(name: String): Option[(Int, Int)] = {
		getImageFileHeight(name) match {
			case None => None
			case Some(height) => {
				getImageFileWidth(name) match {
					case None => None
					case Some(width) => Some((width.toInt, height.toInt))
				}
			}
		}
	}

	private def getImageFileHeight(name: String) = {
		properties.get(heightKey(name))
	}

	private def getImageFileWidth(name: String) = {
		properties.get(widthKey(name))
	}

	private def widthKey(name: String) = {
		name + ".width"
	}

	private def heightKey(name: String) = {
		name + ".height"
	}

	private def addProperty(name: String, value: String) {
		properties.get(name) match {
			case Some(currentValue) =>
				if (!currentValue.equalsIgnoreCase(value)) {
					setPropertyValue(name, value)
				}
			case None =>
				setPropertyValue(name, value)
		}
	}

	private def setPropertyValue(name: String, value: String) {
		if (!propertiesModified) propertiesModified = true
		properties = properties + (name -> value)
	}

	private def findName() = {
		FileUtil.getNameWithoutExtensionFromFile(originalImageFile)
	}

	private def findImageDate() = {
		val format = new SimpleDateFormat("M/d/yyyy")
		properties.get("date") match {
			case Some(dateString) =>
				format.parse(dateString)
			case None =>
				val date = new Date(originalImageFile.lastModified)
				setPropertyValue("date", format.format(date))
				date
		}
	}

	private def savePropertiesFile() {
		System.out.println(f"Saving properties to $propertiesFile")
		PropertiesUtils.writeProperties(properties, propertiesFile)
	}

	private def parsePropertiesFile(propertiesFile: File) = {
		val properties = new Properties()
		if (propertiesFile.exists()) {
			properties.load(new FileInputStream(propertiesFile))
		} else {
			FileUtils.write(propertiesFile, "")
		}
		val unsortedMap = propertiesAsScalaMap(properties)
		unsortedMap.foldLeft(new TreeMap[String, String]()) {
			(map, entry) => map + entry
		}
	}

	private def findPropertiesFile(directory: File) = {
		new File(directory, "info.properties")
	}
}