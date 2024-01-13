package me.honkling.skriptkt.common.node

abstract class Node(val parent: Node? = null) {
    abstract fun accept()
}
