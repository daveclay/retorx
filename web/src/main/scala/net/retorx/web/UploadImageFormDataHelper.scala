package net.retorx.web

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput
import java.io.InputStream

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper
import scala.concurrent.Promise

class UploadImageFormDataHelper {

	def handleSaveImageData(formDataInput: MultipartFormDataInput, f: (Map[String, String], Option[InputStream]) => Unit) = {
		val propertiesPromise = Promise[Map[String, String]]()
		val filePromise = Promise[Option[InputStream]]()

		handleProperties(formDataInput, propertiesPromise)
		handleFileUpload(formDataInput, filePromise)

		for {
			properties <- propertiesPromise.future.value.get
			inputStreamOption <- filePromise.future.value.get
		} yield {
			f(properties, inputStreamOption)
		}
	}

	/**
	  * @param formDataInput
	  * @param propertiesUploadPromise
	  */
	private def handleProperties(formDataInput: MultipartFormDataInput,
								 propertiesUploadPromise: Promise[Map[String, String]]) {
		val propertiesInputPart = getFormDataMap(formDataInput)("properties").get(0)
		val mapper = new ObjectMapper() with ScalaObjectMapper
		mapper.registerModule(DefaultScalaModule)
		val properties = mapper.readValue(propertiesInputPart.getBodyAsString, classOf[Map[String, String]])
		propertiesUploadPromise.success(properties)
	}

	/**
	  *
	  * @param formDataInput
	  * @param fileUploadPromise
	  * @return
	  */
	private def handleFileUpload(formDataInput: MultipartFormDataInput,
								 fileUploadPromise: Promise[Option[InputStream]]) {
		getFormDataMap(formDataInput).get("image") match {
			case Some(imageInputParts) =>
				val imageInputPart = imageInputParts.get(0)
				val inputStream = imageInputPart.getBody(classOf[InputStream], null)
				fileUploadPromise.success(Some(inputStream))
			case None =>
				println("No file provided.")
				fileUploadPromise.success(None)
		}
	}

	private def getFormDataMap(formDataInput: MultipartFormDataInput) = {
		import scala.collection.JavaConverters._
		formDataInput.getFormDataMap.asScala
	}

}
