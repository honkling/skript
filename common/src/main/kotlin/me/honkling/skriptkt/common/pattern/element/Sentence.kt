package me.honkling.skriptkt.common.pattern.element

data class Sentence(val elements: List<PatternElement>) : PatternElement() {
    fun countElements(type: Class<out PatternElement>): Int {
        var count = 0

        for (element in elements) {
            if (type.isAssignableFrom(element::class.java))
                count++

            if (element is Sentence)
                count += element.countElements(type)
        }

        return count
    }

    override fun getLength(): Int {
        return elements.sumOf(PatternElement::getLength) + elements.size - 1
    }
}