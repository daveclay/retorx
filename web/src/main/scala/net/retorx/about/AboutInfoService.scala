package net.retorx.about

import javax.ws.rs._
import com.google.inject.{Inject, Singleton}

@Path("/about")
@Singleton
class AboutInfoService @Inject() (aboutInfoLookup: AboutInfoLookup) {

    @GET
    @Path("/info")
    @Produces(Array("text/json"))
    def info() = {
        aboutInfoLookup.getAboutInfo
    }
}