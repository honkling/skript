package me.honkling.skriptkt.common.pattern.element

import kotlin.text.Regex

data class RegEx(val regex: Regex) : PatternElement() {
    override fun getLength(): Int {
        return regex.pattern.length + 2
    }
}
