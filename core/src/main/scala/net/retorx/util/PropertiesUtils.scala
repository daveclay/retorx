package net.retorx.util

import java.io.{FileOutputStream, File}
import scala.collection.convert.WrapAsJava._
import java.util.Properties

object PropertiesUtils {

	def findPropertiesFile(directory: File) = {
		new File(directory, "info.properties")
	}

	def writeProperties(properties: Map[String, String], file: File) {
		System.out.println(f"Saving properties to $file")
		val javaProperties = new Properties()
		javaProperties.putAll(mapAsJavaMap(properties))
		javaProperties.store(new FileOutputStream(file), "")
	}

}