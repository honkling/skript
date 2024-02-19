package me.honkling.skriptkt.fabric.manager.tree

data class Parameter(
        val name: String,
        val type: Class<*>,
        val required: Boolean
)
