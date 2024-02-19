package me.honkling.skriptkt.fabric.manager.tree

import com.mojang.brigadier.Command
import net.fabricmc.fabric.api.client.command.v2.ClientCommandManager
import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource

class CommandNode(
        parent: Node?,
        name: String,
        val aliases: List<String>,
        val description: String,
        val usage: String,
        val permission: String,
        val permissionMessage: String
) : Node(parent, name) {
    override fun toString(): String {
        return """
            {
                "name": ${stringify(name)},
                "aliases": [${aliases.joinToString(", ", transform = ::stringify)}],
                "description": ${stringify(description)},
                "usage": ${stringify(usage)},
                "permission": ${stringify(permission)},
                "permissionMessage": ${stringify(permissionMessage)},
                "children": [
                    ${children.joinToString(",\n")}
                ]
            }
        """.trimIndent()
    }
}