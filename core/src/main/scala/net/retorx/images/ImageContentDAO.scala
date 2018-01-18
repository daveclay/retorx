package net.retorx.images

import com.google.inject.{Inject, Singleton}

import scala.util.Random
import net.retorx.{ImageContent, ImageFile}
import java.util.concurrent.locks.ReentrantReadWriteLock

import net.retorx.util.LockUtil

import scala.collection.immutable.{SortedSet, TreeSet}

@Singleton
class ImageContentDAO @Inject()(var imageContentLibrary: ImageContentLibrary) {

	private val readWriteLock = new ReentrantReadWriteLock()
	private val writeImageContentLibraryLock = readWriteLock.writeLock()
	private val readImageContentLibrary = readWriteLock.readLock()
	private val random = new Random(System.currentTimeMillis())

	private def reset() {
		setImageContentLibrary(imageContentLibrary.reloadImageDataFromDisk())
	}

	private def setImageContentLibrary(imageContentLibrary: ImageContentLibrary) {
		LockUtil.withLock(writeImageContentLibraryLock, () => {
			this.imageContentLibrary = imageContentLibrary
		})
	}

	private def withImageContentLibrary[U](f: (ImageContentLibrary) => U) = {
		LockUtil.withLock(readImageContentLibrary, () => {
			f(imageContentLibrary)
		})
	}

	def reloadFromFiles() {
		reset()
	}

	def replaceOriginalImage(imageContent: ImageContent) {
		imageContentLibrary.reprocessImagesFromOriginal(imageContent)
	}

	def deleteImageFileForImage(imageContent: ImageContent, imageFile: ImageFile) {
		setImageContentLibrary(imageContentLibrary.buildWithoutImageFile(imageContent, imageFile))
	}

	def renameTag(existingTag: String, newTag: String): Unit = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.renameTag(existingTag, newTag)
		}
	}

	def getTags = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.tags
		}
	}

	def getVisibleTags = {
		getTags.filter { tag => getVisibleImageContentByTag(tag).nonEmpty }
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
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.imageContentByTag.getOrElse(tag, TreeSet[ImageContent]())
		}
	}

	def getVisibleImageContentByTag(tag: String) = {
		getImageContentByTag(tag).filterNot { image => image.isHidden }
	}

	def getAllImageContent = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.imageContents
		}
	}

	def getImageContent(name: String) = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.imageContentByName.get(name)
		}
	}

	def getLatestImages = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.imageContents.filter{
				image => image.properties.get("hideFromLatest").isEmpty
			}.slice(0, 10)
		}
	}
}

