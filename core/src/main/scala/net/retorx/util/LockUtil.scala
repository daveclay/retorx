package net.retorx.util

import java.util.concurrent.locks.Lock

object LockUtil {

	def hi[U] = (lock: Lock) => (f: () => U) => withLock(lock, f)

	def withLock[U](lock: Lock, f: () => U) = {
		lock.lock()
		try {
			f()
		} finally {
			lock.unlock()
		}
	}
}