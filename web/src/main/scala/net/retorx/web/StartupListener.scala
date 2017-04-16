package net.retorx.web

import net.retorx.{InitParamLookup, RetorxModule}
import net.retorx.images.ImageContentDAO
import org.jboss.resteasy.plugins.guice.GuiceResteasyBootstrapServletContextListener
import com.google.inject.Injector
import javax.servlet.ServletContext
import java.util

class StartupListener extends GuiceResteasyBootstrapServletContextListener {

    var servletContextOpt = None

	override def getModules(context: ServletContext): util.List[RetorxModule] = {
		util.Arrays.asList(new RetorxModule(new InitParamLookup {
			override def getInitParameter(name: String): String = {
				context.getInitParameter(name)
			}
		}))
	}

	override def withInjector(injector: Injector): Unit = {
		println("Time to start this shit up")
		injector.getInstance(classOf[ImageContentDAO]).reloadFromFiles()
		println("done!")
	}
}
