package net.retorx.jai

import java.awt.image.BufferedImage
import javax.media.jai.{JAI, KernelJAI}
import java.io.File

object Main {
	def main(args: Array[String]) {
		val imageUtil = new ImageUtil()
		val image = imageUtil.createBufferedImage(new File(args(0)))
		//val edged = RobertsCrossEdgeDetection.process(image)
		// val edged = Erosion.process(image)
		val edged = Threshold.process(image)
		// ImageViewerUI.open(edged)
	}
}

object Threshold {
	def process(image: BufferedImage) = {
		val pb = new java.awt.image.renderable.ParameterBlock()
		pb.addSource(image)

		pb.add(Array(0.0, 0.0, 0.0))
		pb.add(Array(80.0, 205.0, 201.0))
		pb.add(Array(255.0))

		val renderedOp = JAI.create("Threshold", pb)
		renderedOp.getRendering.getAsBufferedImage
	}
}

object Erosion {
	def process(image: BufferedImage) = {
		val pb = new java.awt.image.renderable.ParameterBlock()
		pb.addSource(image)

		val kernel = Array(
			0.0F, 0.0F, 1.0F,
			0.0F, 1.0F, 0.0F,
			0.0F, 0.0F, 0.0F
		)

		pb.add(new KernelJAI(3, 3, kernel))
		val renderedOp = JAI.create("Erode", pb)
		renderedOp.getRendering.getAsBufferedImage

	}
}

object EdgeDetection {

	def process(image: BufferedImage, algorithm: EdgeDetectionAlgorithm) = {
		val pb = new java.awt.image.renderable.ParameterBlock()
		pb.addSource(image)

		val (horizontalKernel, verticalKernel) = algorithm.getKernels

		pb.add(horizontalKernel)
		pb.add(verticalKernel)

		val renderedOp = JAI.create("GradientMagnitude", pb)
		renderedOp.getRendering.getAsBufferedImage
	}
}

trait EdgeDetectionAlgorithm {
	def getKernels: (KernelJAI, KernelJAI)
}

object SobelEdgeDetection {
	def process(image: BufferedImage) = EdgeDetection.process(image, SobelEdgeDetectionAlgorithm)
}

object SobelEdgeDetectionAlgorithm extends EdgeDetectionAlgorithm {
	val sobelH = KernelJAI.GRADIENT_MASK_SOBEL_HORIZONTAL
	val sobelV = KernelJAI.GRADIENT_MASK_SOBEL_VERTICAL

	def getKernels = (sobelH, sobelV)
}

object RobertsCrossEdgeDetection {
	def process(image: BufferedImage) = EdgeDetection.process(image, RobertsCrossEdgeDetectionAlgorithm)
}

object RobertsCrossEdgeDetectionAlgorithm extends EdgeDetectionAlgorithm {
	val roberts_h_data = Array(
		0.0F, 0.0F, -1.0F,
		0.0F, 1.0F, 0.0F,
		0.0F, 0.0F, 0.0F
	)
	val roberts_v_data = Array(
		-1.0F, 0.0F, 0.0F,
		0.0F, 1.0F, 0.0F,
		0.0F, 0.0F, 0.0F
	)

	val horizontalKernel = new KernelJAI(3, 3, roberts_h_data)
	val verticalKernel = new KernelJAI(3, 3, roberts_v_data)

	def getKernels = (horizontalKernel, verticalKernel)
}