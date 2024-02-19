package me.honkling.skriptkt.fabric.manager.types

import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource
import net.minecraft.client.MinecraftClient
import net.minecraft.entity.player.PlayerEntity


object PlayerType : Type<PlayerEntity> {
    override fun validate(sender: FabricClientCommandSource, input: String): Boolean {
        return getPlayer(input.split(" ")[0]) != null
    }

    override fun parse(sender: FabricClientCommandSource, input: String): Pair<PlayerEntity, Int> {
        return getPlayer(input.split(" ")[0])!! to 1
    }

    override fun complete(sender: FabricClientCommandSource, input: String): List<String> {
        val client = MinecraftClient.getInstance()
        val players = client.world!!.players

        return players.map { it.entityName }
    }

    private fun getPlayer(name: String): PlayerEntity? {
        return getPlayer { it.entityName.lowercase() == name.lowercase() }
    }

    private fun getPlayer(predicate: (PlayerEntity) -> Boolean): PlayerEntity? {
        val client = MinecraftClient.getInstance()
        val players = client.world!!.players

        return players.find(predicate)
    }
}