package net.retorx.web

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput
import javax.ws.rs.core.MultivaluedMap
import scala.collection.JavaConverters._
import java.io.InputStream

class MultipartHandler {

    def handleMultipartData(input: MultipartFormDataInput,
                            f: (Option[String], InputStream) => Unit) {
        handleMultipartData("file", input, f)
    }

    def handleMultipartData(fileInputField: String,
                            input: MultipartFormDataInput,
                           f: (Option[String], InputStream) => Unit) {
        val uploadForm = input.getFormDataMap
        val inputParts = uploadForm.get(fileInputField).asScala
        inputParts.foreach(inputPart => {
            val headers = inputPart.getHeaders
            val filename = findFileName(headers)
            val inputStream = inputPart.getBody(classOf[InputStream], null)
            f(filename, inputStream)
        })
    }

    /**
     * 	Content-Type=[image/png],
     * 	Content-Disposition=[form-data; name="file"; filename="filename.extension"]
     **/
    private def findFileName(header: MultivaluedMap[String, String]) = {
        val first: String = header.getFirst("Content-Disposition")
        val contentDisposition = first.split(";")
        findFilenameInContentDisposition(contentDisposition)
    }

    private def findFilenameInContentDisposition(contentDisposition: Array[String]) = {
        contentDisposition.find(filename => {
            filename.trim().startsWith("filename")
        }) match {
            case Some(filenamePair) =>
                val nameParts = filenamePair.split("=")
                val name = nameParts(1)
                Some(name.trim().replaceAll("\"", ""))
            case None => None
        }
    }

}