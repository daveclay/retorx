package net.retorx.about

import com.google.inject.{Singleton, Inject}
import com.google.inject.name.Named
import java.io.File
import org.apache.commons.io.{FileUtils, IOUtils}
import java.util.concurrent.{TimeUnit, Executors}
import java.util.Timer
import net.retorx.util.{PeriodicFileReaderTask, PeriodicFileReader}

@Singleton
class AboutInfoFactory @Inject() (@Named("content.dir") contentDir:File) {

    def newAboutInfo() = {
        contentDir.listFiles().find(file => {
            file.getName.equals("about.html")
        }) match {
            case Some(file) => new AboutInfoLookup(file)
            case None => {
                val file = new File(contentDir, "about.html")
                FileUtils.write(file, "")
                new AboutInfoLookup(file)
            }
        }
    }
}

case class AboutInfo(data: String)

class AboutInfoLookup(aboutInfo:File) {

    var info: String = ""

    def getAboutInfo = {
        new AboutInfo(info)
    }

    val handler = (file: File) => {
        println("Reading new about file")
        info = FileUtils.readFileToString(file)
    }

    val reader = new PeriodicFileReader(aboutInfo, handler)
    val task = new PeriodicFileReaderTask(reader)
    val daemonThreads = true
    new Timer(daemonThreads).scheduleAtFixedRate(task, 0, 1000)
}