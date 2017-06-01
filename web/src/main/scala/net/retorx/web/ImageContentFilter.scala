package net.retorx.web

import javax.servlet._
import javax.servlet.http.HttpServletRequest

import com.google.inject.{Inject, Singleton}
import net.retorx.ImageContentService

@Singleton
class ImageContentFilter @Inject() (imageContentService: ImageContentService) extends Filter {

	override def init(filterConfig: FilterConfig) = {
		println(imageContentService)
	}

	override def destroy() = {
	}

	override def doFilter(servletRequest: ServletRequest,
						  servletResponse: ServletResponse,
						  filterChain: FilterChain) = {

		val request = servletRequest.asInstanceOf[HttpServletRequest]
		val name = request.getParameter("pid")
		imageContentService.getImageContent(name) match {
			case Some(imageContent) => request.setAttribute("imageContent", imageContent)
			case None =>
		}

		filterChain.doFilter(servletRequest, servletResponse)
	}
}
