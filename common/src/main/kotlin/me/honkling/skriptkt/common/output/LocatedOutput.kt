package me.honkling.skriptkt.common.output

import java.io.File

open class LocatedOutput(
    val type: OutputType,
    val file: File,
    val start: Int,
    val message: String
) {
    override fun toString(): String {
        val className = this::class.java.simpleName

        return "$className(file=$file, start=$start, message=$message)"
    }
}