package me.honkling.skriptkt.common.output

import java.io.File

open class LocatedOutput(
    val type: OutputType,
    val file: File,
    val start: Int,
    val message: String
) {
    fun getPosition(input: String): Pair<Int, Int> {
        val before = input.substring(0, start)
        val lineNumber = before.split("\n").size
        val column = start - before.lastIndexOf("\n") + 1

        return lineNumber to column
    }

    fun getLine(input: String): String {
        val before = input.substring(0, start)
        val after = input.substring(start, 0)
        val start = before.lastIndexOf("\n") + 1
        val end = after.indexOf("\n")

        return input.substring(start, end)
    }

    override fun toString(): String {
        val className = this::class.java.simpleName

        return "$className(file=$file, start=$start, message=$message)"
    }
}