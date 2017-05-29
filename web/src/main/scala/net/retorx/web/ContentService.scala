package net.retorx.web

import net.retorx.ImageContent
import net.retorx.images.ImageContentDAO
import org.jboss.resteasy.spi.NotFoundException

trait ContentService {
	implicit def imageContentDAO: ImageContentDAO

	protected def withImageContent[T] = (name: String) => (f: (ImageContent) => T) => {
		imageContentDAO.getImageContent(name) match {
			case Some(imageContent) => f(imageContent)
			case None =>
				throw new NotFoundException("image content " + name + " does not exist")
		}
	}

}
