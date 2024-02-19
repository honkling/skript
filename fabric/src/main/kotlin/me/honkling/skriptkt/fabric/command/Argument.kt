package me.honkling.skriptkt.fabric.command

import me.honkling.skriptkt.common.syntax.Type

data class Argument<T>(
    val name: String,
    val variable: String?,
    val type: Type<T>,
    val defaultValue: T?
)
