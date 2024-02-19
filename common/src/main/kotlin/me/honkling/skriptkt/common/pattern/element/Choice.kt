package me.honkling.skriptkt.common.pattern.element

data class Choice(val choices: Map<Sentence, String?>) : PatternElement() {
    override fun getLength(): Int {
        // Sentences + pipes (choices - 1) + brackets (2)
        val tags = choices.values.filterNotNull().sumOf { it.length + 1 }
        val sentences = choices.keys.sumOf(Sentence::getLength)
        val pipes = choices.size - 1
        val brackets = 2

        return sentences + tags + pipes + brackets
    }
}
