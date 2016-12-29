package net.retorx.images

import java.io.File
import net.retorx.util.FileUtil

object Hi {
	val processedImageDirectoryName = "net.retorx.processedImages"
}

object Mover {
	def main(args: Array[String]) {
		recurseMove(new File(args(0)))
	}

	def recurseMove(file: File) {
		if (file.getName.equals(".net.retorx.processedImages")) {
			file.renameTo(new File(file.getParentFile, Hi.processedImageDirectoryName))
		} else if (file.isDirectory) {
			file.listFiles().foreach(file => recurseMove(file))
		}
	}
}

trait ImageFileLocator {

	/**
	 * Locate a file where a processed file exists or will be saved to.
	 * @param originalFile
	 * @return
	 */
	def getProcessedFileDirectory(originalFile: File) = {
		val imageDirectory = originalFile.getParentFile
		val processedImageDirectory = new File(imageDirectory, Hi.processedImageDirectoryName)

		if (!processedImageDirectory.exists()) {
			processedImageDirectory.mkdirs()
		}

		if (!processedImageDirectory.isDirectory) {
			throw new IllegalArgumentException("The processed image directory can't be created because some weirdo has a file named " + processedImageDirectory.getName)
		}

		processedImageDirectory
	}

	def getProcessedImageFile(originalFile: File): File

}

/**
 * This is a class that defines both where to find a file containing a previously processed image, or where to
 * write a processed image to.
 *
 * Normally, this is just the original file defined by the ImageContentData with a particular suffix.
 *
 * The SimpleProcessedFileLocator is just such a locator.
 */
class ProcessedOriginalFileLocator(fileUtil: FileUtil, processedImageFileName: String) extends ImageFileLocator {

	val processedFileSuffix = "-" + processedImageFileName + ".png"

	def this(processedImageFileName: String) {
		this(new FileUtil(), processedImageFileName)
	}

	override def getProcessedImageFile(originalFile: File) = {
		val processedFileName = FileUtil.createFilenameWithSuffix(originalFile, processedFileSuffix)
		val processedImageDirectory = getProcessedFileDirectory(originalFile)
		fileUtil.newFile(processedImageDirectory, processedFileName)
	}
}

/**
 * When the processed file is based on the given file with the given suffix in the processed file directory
 * for the main image
 * @param file
 * @param processedFileSuffix
 */
class ProcessedFileLocator(file: File, processedFileSuffix: String) extends ImageFileLocator {

	override def getProcessedImageFile(originalFile: File) = {
		val processedFileName = FileUtil.createFilenameWithSuffix(file, processedFileSuffix + ".png")
		val processedImageDirectory = getProcessedFileDirectory(originalFile)
		new File(processedImageDirectory, processedFileName)
	}
}

/**
 * When the processed file is the original file
 */
class OriginalFileLocator extends ImageFileLocator {
	def getProcessedImageFile(originalFile: File) = {
		originalFile
	}
}

/**
 * When the processed file is a specific file
 * @param file the processed file
 */
class SimpleProcessedFileLocator(file: File) extends ImageFileLocator {
	def getProcessedImageFile(originalFile: File) = {
		file
	}
}

