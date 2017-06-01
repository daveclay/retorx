package net.retorx.web

import net.retorx.RetorxModule
import net.retorx.images.ImageContentDAO
import org.jboss.resteasy.plugins.guice.GuiceResteasyBootstrapServletContextListener
import com.google.inject.{Injector, Module}
import javax.servlet.ServletContext
import java.util

import com.google.inject.servlet.ServletModule

class StartupListener extends GuiceResteasyBootstrapServletContextListener {

    var servletContextOpt = None

	override def getModules(context: ServletContext): util.List[Module] = {
		util.Arrays.asList(new RetorxModule((name: String) => {
			context.getInitParameter(name)
		}), new ServletModule() {
			override def configureServlets() {
				filter("/share/*").through(classOf[ImageContentFilter])
			}

		})
	}

	override def withInjector(injector: Injector): Unit = {
		println("Time to start this shit up")
		injector.getInstance(classOf[ImageContentDAO]).reloadFromFiles()
		println("done!")
	}
}
