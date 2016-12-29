package net.retorx.config

import javax.ws.rs._
import com.google.inject.{Singleton, Inject}
import org.jboss.resteasy.annotations.cache.{NoCache, Cache}
import com.google.inject.name.Named
import java.io.{FileOutputStream, File}
import org.apache.commons.io.IOUtils
import java.nio.charset.Charset

class SiteContentService @Inject() (@Named("content.dir") contentDir:File) {

    val cssDir = new File(contentDir, "css")

    def getCSSFile = {
        new File(cssDir, "site.css")
    }

    def saveCSS(css: String) = {
        IOUtils.write(css, new FileOutputStream(getCSSFile), Charset.forName("UTF-8"))
    }
}

@Singleton
@Path("/config")
class ConfigService @Inject() (siteContentService: SiteContentService) {

	@GET
	@Path("/css")
	@Produces(Array("text/css"))
	def getCSS = {
        siteContentService.getCSSFile
	}
}
