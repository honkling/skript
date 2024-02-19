package me.honkling.skriptkt.fabric.manager.types

import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource

object StringType : Type<String> {
    private val regex = Regex("^(\"([^\"]|\\\\\")*\"|\\S+)")

    override fun validate(sender: FabricClientCommandSource, input: String): Boolean {
        return regex.containsMatchIn(input)
    }

    override fun parse(sender: FabricClientCommandSource, input: String): Pair<String, Int> {
        val match = regex.find(input)!!.value
        val size = match.split(" ").size

        if (match.startsWith("\"") && match.endsWith("\""))
            return match
                    .substring(1, match.length - 1)
                    .replace("\\\"", "\"")
                    .replace("\\\\", "\\") to size

        return match to size
    }

    override fun complete(sender: FabricClientCommandSource, input: String): List<String> {
        return emptyList()
    }
}