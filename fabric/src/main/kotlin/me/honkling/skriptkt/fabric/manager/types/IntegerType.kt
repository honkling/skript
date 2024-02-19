package me.honkling.skriptkt.fabric.manager.types

import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource


object IntegerType : Type<Int> {
    override fun validate(sender: FabricClientCommandSource, input: String): Boolean {
        val regex = Regex("^\\d+(?!\\S)")
        return regex.containsMatchIn(input)
    }

    override fun parse(sender: FabricClientCommandSource, input: String): Pair<Int, Int> {
        return input.split(" ")[0].toInt() to 1
    }

    override fun complete(sender: FabricClientCommandSource, input: String): List<String> {
        return emptyList()
    }
}