package me.honkling.skriptkt.fabric.manager.types

import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource

interface Type<T> {
    fun validate(sender: FabricClientCommandSource, input: String): Boolean
    fun parse(sender: FabricClientCommandSource, input: String): Pair<T, Int>
    fun complete(sender: FabricClientCommandSource, input: String): List<String>
}