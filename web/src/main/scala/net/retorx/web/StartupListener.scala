package net.retorx.web

import javax.servlet.{ServletContext, ServletContextEvent, ServletContextListener}
import org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap

import org.jboss.resteasy.spi.Registry
import org.jboss.resteasy.spi.ResteasyProviderFactory
import net.retorx.{InitParamLookup, RetorxModule}
import net.retorx.images.ImageContentDAO

class StartupListener extends ResteasyBootstrap with ServletContextListener with InitParamLookup {

    var servletContextOpt:Option[ServletContext] = None

	override def contextDestroyed(servletContextEvent: ServletContextEvent) {}

	override def contextInitialized(servletContextEvent: ServletContextEvent) {
        servletContextOpt = Some(servletContextEvent.getServletContext)
        super.contextInitialized(servletContextEvent)

        println("Time to start this shit up")

        val context = servletContextOpt.get
        val registry = context.getAttribute(classOf[Registry].getName).asInstanceOf[Registry]
        val providerFactory = context.getAttribute(classOf[ResteasyProviderFactory].getName).asInstanceOf[ResteasyProviderFactory]
        val processor = new ModuleProcessor(registry, providerFactory)

        val module = new RetorxModule(this)
        val injector = processor.process(module)

        injector.getInstance(classOf[ImageContentDAO]).reloadFromFiles()

        println("done!")
	}

    private def getServletContext = {
        servletContextOpt match {
            case Some(servletContext) => servletContext
            case None => throw new IllegalStateException("No ServletContext available yet!")
        }
    }

    override def getInitParameter(name:String) = {
        getServletContext.getInitParameter(name) match {
            case null => System.getProperty(name) // fall back to the System.properties
            case value: String => value
        }
    }
}
