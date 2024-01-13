package me.honkling.skriptkt.common.pattern

data class Pattern(val pattern: String) {
    val compiledPattern = compilePattern(pattern.replace(Regex(" +"), " "))
}
