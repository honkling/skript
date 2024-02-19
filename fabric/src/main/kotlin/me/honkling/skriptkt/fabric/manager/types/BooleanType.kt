package me.honkling.skriptkt.fabric.manager.types

import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource


object BooleanType : Type<Boolean> {
    override fun validate(sender: FabricClientCommandSource, input: String): Boolean {
        val regex = Regex("^(true|false)(?!\\S)", RegexOption.IGNORE_CASE)
        return regex.containsMatchIn(input)
    }

    override fun parse(sender: FabricClientCommandSource, input: String): Pair<Boolean, Int> {
        return input.split(" ")[0].toBoolean() to 1
    }

    override fun complete(sender: FabricClientCommandSource, input: String): List<String> {
        return listOf("true", "false").filter { it.contains(input.lowercase().split(" ")[0]) }
    }
}