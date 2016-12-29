package net.retorx.util

import com.google.inject.{Inject, Injector, Singleton}
import net.sf.corn.cps.{ClassFilter, CPScanner}

class GuiceScanner[T](injector: Injector, packages: Array[String]) {

    def addInstance(instance: T) {
    }

    private def getInstances(classes: Array[Class[_ <: T]]) = {
        classes.map(aClass => injector.getInstance(aClass))
    }

    /*
    private def registerImageProcessors(injector: Injector) {
        val lookup = injector.getInstance(classOf[T])
        bindImplementations(classOf[ImageFileBuilderConfig], injector, (strategy: ImageFileBuilderConfig) => {
            lookup.addImageProcessor(strategy)
        })
    }
    */

    def bindImplementations[T](interface: Class[T], injector: Injector, f: T => Unit) {
        val classes = findImplementationsIn(interface, packages)
        import scala.collection.JavaConversions._
        for (clazz <- classes) {
            val instance = injector.getInstance(clazz)
            f(instance)
        }
    }

    def findImplementationsIn[T](interface: Class[T], packages: Array[String]) = {
        val listenerClasses = new java.util.ArrayList[Class[T]]()
        for (p <- packages) {
            val classes = CPScanner.scanClasses(new ClassFilter().packageName(p).interfaceClass(interface))
            listenerClasses.addAll(classes.asInstanceOf[java.util.List[Class[T]]])
        }
        listenerClasses
    }
 }