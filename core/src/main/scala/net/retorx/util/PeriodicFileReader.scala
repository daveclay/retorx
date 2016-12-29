package net.retorx.util

import java.io.File


class PeriodicFileReader(file: File, handler: File => Unit) {

	var previousLastModified = 0L

	def open() {
		handler(file)
		previousLastModified = file.lastModified()
	}

	def checkFile() {
		val currentLastModified = file.lastModified()
		if (previousLastModified != currentLastModified) {
			previousLastModified = currentLastModified
			handler(file)
		}
	}
}