package net.retorx.util

import java.io.File

object FileUtil {

	def getExtension(file: File) = {
		file.getName.substring(file.getName.lastIndexOf(".") + 1)
	}

	def createFilenameWithSuffix(file: File, suffix: String) = {
		getNameWithoutExtensionFromFile(file) + suffix
	}

	def getNameWithoutExtensionFromFile(file: File) = {
		file.getName.substring(0, file.getName.lastIndexOf("."))
	}

	def isImage(file: File) = {
		FileUtil.getExtension(file) match {
			case "png" => true
			case "jpg" => true
			case _ => false
		}
	}
}

class FileUtil {

	def newFile(parent: File, name: String) = new File(parent, name)
}