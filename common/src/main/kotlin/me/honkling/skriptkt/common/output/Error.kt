package me.honkling.skriptkt.common.output

import java.io.File

class Error(
    file: File,
    start: Int,
    message: String
) : LocatedOutput(OutputType.ERROR, file, start, message)
