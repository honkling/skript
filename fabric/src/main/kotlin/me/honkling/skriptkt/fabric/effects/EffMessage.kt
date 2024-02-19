package me.honkling.skriptkt.fabric.effects

import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.output.emitWarning
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.EffectStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.syntax.Effect
import me.honkling.skriptkt.fabric.mm
import net.minecraft.client.MinecraftClient

@Syntax("send [(action:action bar)] %strings% [to player]")
class EffMessage : Effect() {
    override fun accept(statement: EffectStatement) {
        val player = MinecraftClient.getInstance().player!!
        val component = mm.deserialize(statement.matchResult.expressions[0].value!! as String)

        if ("action" in statement.matchResult.tags) {
            player.sendActionBar(component)
            return
        }

        player.sendMessage(component)
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        if (MinecraftClient.getInstance().player == null) {
            emitWarning("Player is not connected to a world")
            return false
        }

        return true
    }
}