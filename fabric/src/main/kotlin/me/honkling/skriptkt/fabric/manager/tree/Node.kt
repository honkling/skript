package me.honkling.skriptkt.fabric.manager.tree

abstract class Node(val parent: Node?, val name: String) {
	val children = mutableListOf<Node>()

	protected fun stringify(string: String): String {
		return "\"${string.replace("\\", "\\\\").replace("\"", "\\\"")}\""
	}

	abstract override fun toString(): String
}