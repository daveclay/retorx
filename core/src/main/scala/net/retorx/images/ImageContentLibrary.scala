package net.retorx.images

import com.google.inject.{Inject, Singleton}
import net.retorx.{ImageContent, ImageFile}

import scala.collection.immutable.{SortedSet, TreeSet}

@Singleton
class ImageContentLibrary @Inject()(imagesDirectoryManager: ImagesDirectoryManager) {

	var imageContentById = Map[String, ImageContent]()
	var imageContentByName = Map[String, ImageContent]()
	var imageContentByTag = Map[String, SortedSet[ImageContent]]()
	var imageContents = TreeSet[ImageContent]()
	var tags = List[String]()

	def reloadImageDataFromDisk() = {
		val imageContentLibrary = new ImageContentLibrary(imagesDirectoryManager)
		imageContentLibrary.loadDefaultTags()
		imagesDirectoryManager.loadImagesFromDisk { imageContent =>
			imageContentLibrary.addExistingImageContent(imageContent)
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
	def buildWithoutImageFile(imageContent: ImageContent, imageFile: ImageFile): ImageContentLibrary = {
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

	private def addExistingImageContent(imageContent: ImageContent) {
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

	def renameTag(existingTag: String, newTag: String) {
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
