package me.honkling.skriptkt.fabric.command

import me.honkling.skriptkt.common.node.Block

data class Command(
    val name: String,
    val arguments: Argument<*>,
    val block: Block
)