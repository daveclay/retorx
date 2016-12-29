package net.retorx

import java.util.Date
import util.IDGenerator

trait Content {

	val name: String
	val date: Date

	def getId = {
		IDGenerator.generateId(name)
	}

	def getName = name

	def getDate = date
}
