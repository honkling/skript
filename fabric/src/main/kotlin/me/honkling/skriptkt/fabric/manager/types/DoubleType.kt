package me.honkling.skriptkt.fabric.manager.types

import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource

object DoubleType : Type<Double> {
    override fun validate(sender: FabricClientCommandSource, input: String): Boolean {
        val regex = Regex("^\\d+(\\.\\d+(?!\\S))?")
        return regex.containsMatchIn(input)
    }

    override fun parse(sender: FabricClientCommandSource, input: String): Pair<Double, Int> {
        return input.split(" ")[0].toDouble() to 1
    }

    override fun complete(sender: FabricClientCommandSource, input: String): List<String> {
        return emptyList()
    }
}