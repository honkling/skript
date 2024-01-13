package me.honkling.skriptkt.common.node

import me.honkling.skriptkt.common.statement.Statement

class Block(parent: Block?, val statements: MutableList<Statement>) : Node(parent) {
    override fun accept() {
        for (statement in statements)
            statement.accept()
    }

    override fun toString(): String {
        return "Block(statements=$statements)"
    }
}