package net.retorx.util


object IDGenerator {

	def generateId(name: String) = {
		val chars = name.toArray
		for (i <- 0 until chars.length) {
			val char = chars(i)
			if (!Character.isJavaIdentifierPart(char)) {
				chars(i) = '_'
			}
		}

		new String(chars)
	}
}
