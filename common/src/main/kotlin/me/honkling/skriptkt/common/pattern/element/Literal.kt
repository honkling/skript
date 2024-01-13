package me.honkling.skriptkt.common.pattern.element

data class Literal(val value: String) : PatternElement() {
    override fun getLength(): Int {
        return value.length
    }
}
