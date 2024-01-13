package me.honkling.skriptkt.common.pattern.element

data class Optional(val sentence: Sentence) : PatternElement() {
    override fun getLength(): Int {
        return sentence.getLength() + 2
    }
}