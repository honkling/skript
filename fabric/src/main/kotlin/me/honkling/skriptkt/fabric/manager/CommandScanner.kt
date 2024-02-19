package me.honkling.skriptkt.fabric.manager

import me.honkling.skriptkt.common.lib.getClassesInPackage
import me.honkling.skriptkt.fabric.manager.annotations.Command
import me.honkling.skriptkt.fabric.manager.tree.CommandNode
import me.honkling.skriptkt.fabric.manager.tree.Node
import me.honkling.skriptkt.fabric.manager.tree.Parameter
import me.honkling.skriptkt.fabric.manager.tree.SubcommandNode
import net.minecraft.client.network.ClientPlayerEntity
import java.lang.reflect.Method
import java.lang.reflect.Modifier

fun scanForCommands(manager: CommandManager, pkg: String): List<CommandNode> {
	val clazz = CommandManager::class.java
	val classes = getClassesInPackage(clazz, pkg, ::isCommand)

	return parseClasses(manager, classes)
}

private fun parseClasses(manager: CommandManager, classes: List<Class<*>>): List<CommandNode> {
	return classes.map { parseClass(manager, null, it) }
}

private fun parseClass(manager: CommandManager, parent: Node?, clazz: Class<*>): CommandNode {
	val annotation = clazz.getAnnotation(Command::class.java)
	val node = CommandNode(
			parent,
			annotation.name.lowercase(),
			annotation.aliases.toList(),
			annotation.description,
			annotation.usage,
			annotation.permission,
			annotation.permissionMessage
	)

	node.children.addAll(parseChildren(manager, node, clazz))

	return node
}

private fun parseChildren(manager: CommandManager, node: Node, clazz: Class<*>): List<Node> {
	val nodes = mutableListOf<Node>()
	val classes = clazz.classes.filter { isCommand(it) }
	val methods = clazz.declaredMethods.filter { isSubcommand(manager, it) }

	nodes.addAll(methods.mapNotNull { parseSubcommand(manager, node, it) })
	nodes.addAll(classes.mapNotNull { parseClass(manager, node, it) })

	return nodes
}

private fun parseSubcommand(manager: CommandManager, parent: Node, method: Method): SubcommandNode? {
	if (!validateParameters(manager, method)) {
		manager.logger.warn("Skipping invalid subcommand '${method.name}'")
		return null
	}

	return SubcommandNode(
			parent,
			method,
			method.name.lowercase(),
			parseParameters(method)
	)
}

private fun validateParameters(manager: CommandManager, method: Method): Boolean {
	var hasOptional = false

	val first = method.parameters.first().type
	if (first !in listOf(
			ClientPlayerEntity::class.java
	)) {
		manager.logger.warn("Invalid executor parameter. (expected Player, ConsoleCommandSender, or CommandSender. found ${first.name})")
		return false
	}

	for (parameter in method.parameters.slice(1 until method.parameters.size)) {
		val isRequired = parameter.annotations.none { "Nullable" in (it.annotationClass.qualifiedName ?: "") }

		if (hasOptional && isRequired) {
			manager.logger.warn("Found required parameter after an optional parameter")
			return false
		}

		if (!isRequired)
			hasOptional = true

		if (!validateParameter(manager, parameter))
			return false
	}

	return true
}

private fun validateParameter(manager: CommandManager, parameter: java.lang.reflect.Parameter): Boolean {
	val type = getParameterType(parameter)
	
	if (type !in manager.types) {
		manager.logger.warn("Found parameter '${parameter.name}' using an invalid type '${type.name}'")
		return false
	}

	return true
}

private fun parseParameters(method: Method): List<Parameter> {
	return method.parameters.map { parameter ->
		val type = getParameterType(parameter)
		val isRequired = isParameterRequired(parameter)

		Parameter(parameter.name, type, isRequired)
	}.slice(1..<method.parameters.size)
}

private fun isParameterRequired(parameter: java.lang.reflect.Parameter): Boolean {
	return parameter.annotations.none { "Nullable" in (it.annotationClass.qualifiedName ?: "") }
}

private fun getParameterType(parameter: java.lang.reflect.Parameter): Class<*> {
	return Class.forName(parameter
			.type
			.name
			.replace("byte", "java.lang.Byte")
			.replace("long", "java.lang.Long")
			.replace("int", "java.lang.Integer")
			.replace("short", "java.lang.Short")
			.replace("float", "java.lang.Float")
			.replace("double", "java.lang.Double")
			.replace("char", "java.lang.Character")
			.replace("boolean", "java.lang.Boolean"))
}

private fun isSubcommand(manager: CommandManager, method: Method): Boolean {
	val modifiers = method.modifiers
	val isPublic = Modifier.isPublic(modifiers)
	val isStatic = Modifier.isStatic(modifiers)

	if (isPublic && !isStatic) {
		manager.logger.warn("Found a public non-static method '${method.name}'. Please make this static (to be registered as a subcommand) or private (to hide this warning)")
		return false
	}

	return isPublic
}

private fun isCommand(clazz: Class<*>): Boolean {
	return clazz.isAnnotationPresent(Command::class.java)
}