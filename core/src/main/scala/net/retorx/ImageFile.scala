package net.retorx

import java.io.File
import net.retorx.util.{FileUtil, IDGenerator}
import com.fasterxml.jackson.annotation.JsonIgnore

case class ImageFile(name: String,
					 width: Int,
					 height: Int,
					 imageType: String,
					 @JsonIgnore file: File) {

	def getId = IDGenerator.generateId(name)
}
