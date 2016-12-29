package net.retorx

import net.retorx.web.{AdminContentService, JacksonScalaContextResolver}
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider
import com.google.inject._
import java.io.File
import com.google.inject.name.Names
import net.retorx.images._
import net.retorx.about.{AboutInfoService, AboutInfoFactory}
import net.retorx.images.processors.ImageFileBuilderLookup
import net.retorx.jai.ImageUtil

class RetorxModule(initParamLookup:InitParamLookup) extends AbstractModule {

    def configure() {
        bind(classOf[JacksonScalaContextResolver])
        bind(classOf[JacksonJaxbJsonProvider])

        val managerType = initParamLookup.getInitParameter("retorx.imagecontent.type") match {
            case "figureDrawing" => classOf[FigureDrawingManagerType]
            case _ => classOf[RetorxManagerType]
        }

        bind(classOf[ManagerType]).to(managerType)
        bind(classOf[AboutInfoService])
        bind(classOf[AdminContentService])
        bind(classOf[ImageContentService])
        bind(classOf[ImageUtil])
        bind(classOf[ImageFileBuilderLookup])
        bind(classOf[ImageContentDAO])
        bind(classOf[ImagesDirectoryManager])
        bind(classOf[InitParamLookup]).toInstance(initParamLookup)
        bind(classOf[File]).annotatedWith(Names.named("content.dir")).toInstance(new File(initParamLookup.getInitParameter("content.dir")))
    }

    @Provides
    @Singleton
    def provideAboutInfoService(factory: AboutInfoFactory) = {
        factory.newAboutInfo()
    }

}