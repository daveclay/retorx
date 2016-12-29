package net.retorx.util

import java.io.{FileOutputStream, File}
import scala.collection.convert.WrapAsJava._
import java.util.Properties

object PropertiesUtils {

	def writeProperties(properties: Map[String, String], file: File) {
		val javaProperties = new Properties()
		javaProperties.putAll(mapAsJavaMap(properties))
		javaProperties.store(new FileOutputStream(file), "")
	}

}