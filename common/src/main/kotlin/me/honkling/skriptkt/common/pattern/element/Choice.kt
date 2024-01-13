package me.honkling.skriptkt.common.pattern.element

data class Choice(val choices: List<Sentence>) : PatternElement() {
    override fun getLength(): Int {
        // Sentences + pipes (choices - 1) + brackets (2)
        return choices.sumOf(Sentence::getLength) + choices.size + 1
    }
}
