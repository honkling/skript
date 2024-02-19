package me.honkling.skriptkt.fabric.manager.tree

import java.lang.reflect.Method

class SubcommandNode(
		parent: Node,
		val method: Method,
		name: String,
		val parameters: List<Parameter>
) : Node(parent, name) {
	override fun toString(): String {
		return """
			{
				"name": ${stringify(name)},
				"parameters": ["${parameters.joinToString("\", \"")}"],
				"method": ${stringify(method.name + " " + method.toString())}
			}
		""".trimIndent()
	}
}