package net.retorx.images

import com.google.inject.{Inject, Singleton}
import scala.util.Random
import net.retorx.{ImageFile, ImageContent}
import java.util.concurrent.locks.ReentrantReadWriteLock
import net.retorx.util.LockUtil
import scala.collection.immutable.{SortedSet, TreeSet}

@Singleton
class ImageData @Inject()(imagesDirectoryManager: ImagesDirectoryManager) {

	var imageContentByName = Map[String, ImageContent]()
	var imageContentByTag = Map[String, SortedSet[ImageContent]]()
	var imageContents = TreeSet[ImageContent]()
	var tags = List[String]()

	def reloadImageDataFromDisk() = {
		val newImageData = new ImageData(imagesDirectoryManager)
		newImageData.loadDefaultTags()
		imagesDirectoryManager.loadImagesFromDisk { imageContent =>
			newImageData.addImageContent(imageContent)
		}
		newImageData
	}

	def reprocessImagesFromOriginal(imageContent: ImageContent) {
		imagesDirectoryManager.reprocessImagesFromOriginal(imageContent)
	}

	/**
	 * Rebuild the entire ImageData set of images without the specified file. Then again, maybe just mark these
	 * as fucking hidden and avoid the whole confusion.
	 */
	def buildWithoutImageFile(imageContent: ImageContent, imageFile: ImageFile) = {
		imagesDirectoryManager.deleteImageFile(imageFile)
		// Todo: remove properties? Do we know which ones? Assume? What fucking properties are you talking about?
		// imageContent.setImageFiles(imageContent.getImageFiles.filterNot(anImageFile => anImageFile.name.equals(imageContent.name)))
		val imageData = newImageData()
		// Todo: copy maps, after filtering. probably rebuild tags.
		imageData
	}

	private def newImageData() = {
		new ImageData(imagesDirectoryManager)
	}

	private def loadDefaultTags() {
		tags = imagesDirectoryManager.getDefaultTags.foldLeft(List[String]())((tags, tag) => tags :+ tag.trim())
	}

	def addImageContent(imageContent: ImageContent) = {
		synchronized {
			imageContentByName = imageContentByName + (imageContent.getName -> imageContent)
			handleImageContentTags(imageContent)
			imageContents = imageContents + imageContent
		}
	}

	private def handleImageContentTags(imageContent: ImageContent) {
		imageContent.getTags.foreach(imageContentTag => {
			val tag = imageContentTag.trim()
			if (!tags.contains(tag)) {
				tags = tags :+ tag
			}
			val imageContentForTag = imageContentByTag.getOrElse(tag, TreeSet[ImageContent]())
			val addedImageContentsForTag = imageContentForTag + imageContent
			addImageContentByTagEntry(tag, addedImageContentsForTag)
		})
	}

	private def addImageContentByTagEntry(tag: String, imageContentsForTag: SortedSet[ImageContent]) {
		imageContentByTag = imageContentByTag + (tag -> imageContentsForTag)
	}

	def renameTag(existingTag: String, newTag: String) = {
		// Todo: looping around and modifying to inconsistent state.
		imageContentByTag.get(existingTag) match {
			case Some(imageContentsForTag) =>
				imageContentsForTag.par.foreach { imageContent =>
					imageContent.replaceTag(existingTag, newTag)
					imageContent.savePropertiesFile()
				}
				imagesDirectoryManager.renameTag(existingTag, newTag)
				imageContentByTag = (imageContentByTag - existingTag) + (newTag -> imageContentsForTag)
			case None =>
		}
	}
}

@Singleton
class ImageContentDAO @Inject()(var imageData: ImageData) {

	private val readWriteLock = new ReentrantReadWriteLock()
	private val writeImageDataLock = readWriteLock.writeLock()
	private val readImageDataLock = readWriteLock.readLock()
	private val random = new Random(System.currentTimeMillis())

	private def reset() {
		setImageData(imageData.reloadImageDataFromDisk())
	}

	private def setImageData(newImageData: ImageData) {
		LockUtil.withLock(writeImageDataLock, () => {
			imageData = newImageData
		})
	}

	private def withImageData[U](f: (ImageData) => U) = {
		LockUtil.withLock(readImageDataLock, () => {
			f(imageData)
		})
	}

	def reloadTags() {
		reset()
	}

	def reloadFromFiles() {
		reset()
	}

	def replaceOriginalImage(imageContent: ImageContent) {
		imageData.reprocessImagesFromOriginal(imageContent)
	}

	def addImageContent(imageContent: ImageContent) = {
		withImageData((imageData) => imageData.addImageContent(imageContent))
	}

	def deleteImageFileForImage(imageContent: ImageContent, imageFile: ImageFile) = {
		setImageData(imageData.buildWithoutImageFile(imageContent, imageFile))
	}

	def renameTag(existingTag: String, newTag: String): Unit = {
		withImageData { imageData =>
			imageData.renameTag(existingTag, newTag)
		}
	}

	def getTags = {
		withImageData((imageData) => {
			imageData.tags
		})
	}

	def createTagImage(tag: String) = {
		None
	}

	def getRandomTagImageFile(tag: String) = {
		val imageContent = getRandomImageContentForTag(tag)
		imageContent.getImageFileByVersion("tag")
	}

	def getRandomImageContentForTag(tag: String) = {
		val imageContents = getImageContentByTag(tag)
		val idx = random.nextInt(imageContents.size)
		imageContents.slice(idx, idx + 1).head
	}

	def getImageContentByTag(tag: String) = {
		withImageData((imageData) => {
			imageData.imageContentByTag.getOrElse(tag, TreeSet[ImageContent]())
		})
	}

	def getAllImageContent = {
		withImageData((imageData) => {
			imageData.imageContents
		})
	}

	def getImageContent(id: String) = {
		withImageData((imageData) => {
			imageData.imageContentByName(id)
		})
	}

	def getLatestImages = {
		withImageData((imageData) => {
			val tags = imageData.imageContents.head.getTags
			getImageContentByTag(tags(0))
		})
	}
}

