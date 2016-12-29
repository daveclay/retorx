package net.retorx.util

import java.util.TimerTask


class PeriodicFileReaderTask(reader: PeriodicFileReader) extends TimerTask {

	def run() {
		reader.checkFile()
	}
}