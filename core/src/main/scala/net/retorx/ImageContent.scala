package net.retorx

import java.util.{Properties, Date}
import java.io.{FileWriter, File}
import com.fasterxml.jackson.annotation.JsonIgnore

class ImageContent(val name: String,
				   val date: Date,
				   var properties: Map[String, String],
				   @JsonIgnore val imageDirectory: File,
				   val imageFilesByVersion: Map[String, ImageFile]) extends Content with Ordered[ImageContent] {

	val imageFiles = imageFilesByVersion.valuesIterator.toSeq.sortBy((imageFile) => imageFile.name)

	def getImageFiles = imageFiles

	def isHidden = {
		properties.get("hidden") match {
			case Some(hidden) => hidden.toBoolean
			case None => false
		}
	}

	def setProperties(map: Map[String, String]) {
		properties = map
	}

	def savePropertiesFile() {
		import collection.JavaConversions._
		val propertiesToSave = new Properties()
		propertiesToSave.putAll(properties)
		val directory = imageDirectory
		val propertyFile = new File(directory, "info.properties")
		propertiesToSave.store(new FileWriter(propertyFile), "")
	}

	def getProperties = properties

	def replaceTag(existingTag: String, newTag: String) {
		val tags = this.getTags.transform(tag => {
			if (tag.equals(existingTag)) {
				newTag
			} else {
				tag
			}
		})
		val tagsString = tags.mkString(",")
		properties = properties + ("tags" -> tagsString)
	}

	def getTags = {
		var tags = Array.empty[String]
		properties.get("tags") match {
			case tagsOpt: Some[String] => {
				tags = tagsOpt.get.split(",")
			}
			case None => {
				tags = Array("uncategorized")
			}
		}
		tags
	}

	def getImageFileByVersion(name: String) = {
		imageFilesByVersion.get(name)
	}

	def sortByDate(that: ImageContent) = {
		date.compareTo(that.date) > 0
	}

	/**
	 * Ah here's a good problem. A piece of state has a bunch of child state. When I want to change some child state,
	 * I have to know which one, and copy the rest. With immutable objects, that means a lot of boiler plate to
	 * remember which properties to copy.
	 * @param newImageFilesByName
	 * @return
	 */
	def copy(newImageFilesByName: Map[String, ImageFile]) = {
		new ImageContent(name, date, properties, imageDirectory, newImageFilesByName)
	}

	override def hashCode() = name.hashCode

	override def equals(obj: scala.Any) = {
		obj.isInstanceOf[ImageContent] match {
			case true => obj.asInstanceOf[ImageContent].name == name
			case false => false
		}
	}

	def compare(that: ImageContent) = {
		val dateCompare = that.date.compareTo(date)
		if (dateCompare == 0) {
			name.compareTo(that.name)
		} else {
			dateCompare
		}

	}

	override def toString = {
		name + " from " + date
	}
}
