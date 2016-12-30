package net.retorx.images

import com.google.inject.{Inject, Singleton}
import scala.util.Random
import net.retorx.{ImageFile, ImageContent}
import java.util.concurrent.locks.ReentrantReadWriteLock
import net.retorx.util.LockUtil
import scala.collection.immutable.{SortedSet, TreeSet}

@Singleton
class ImageContentLibrary @Inject()(imagesDirectoryManager: ImagesDirectoryManager) {

	var imageContentByName = Map[String, ImageContent]()
	var imageContentByTag = Map[String, SortedSet[ImageContent]]()
	var imageContents = TreeSet[ImageContent]()
	var tags = List[String]()

	def reloadImageDataFromDisk() = {
		val imageContentLibrary = new ImageContentLibrary(imagesDirectoryManager)
		imageContentLibrary.loadDefaultTags()
		imagesDirectoryManager.loadImagesFromDisk { imageContent =>
			imageContentLibrary.addImageContent(imageContent)
		}
		imageContentLibrary
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
		val imageContentLibrary = newImageContentLibrary()
		// Todo: copy maps, after filtering. probably rebuild tags.
		imageContentLibrary
	}

	private def newImageContentLibrary() = {
		new ImageContentLibrary(imagesDirectoryManager)
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

	def reloadTags() {
		reset()
	}

	def reloadFromFiles() {
		reset()
	}

	def replaceOriginalImage(imageContent: ImageContent) {
		imageContentLibrary.reprocessImagesFromOriginal(imageContent)
	}

	def addImageContent(imageContent: ImageContent) = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.addImageContent(imageContent)
		}
	}

	def deleteImageFileForImage(imageContent: ImageContent, imageFile: ImageFile) = {
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

	def getAllImageContent = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.imageContents
		}
	}

	def getImageContent(id: String) = {
		withImageContentLibrary { imageContentLibrary =>
			imageContentLibrary.imageContentByName(id)
		}
	}

	def getLatestImages = {
		withImageContentLibrary { imageContentLibrary =>
			val tags = imageContentLibrary.imageContents.head.getTags
			getImageContentByTag(tags(0))
		}
	}
}

