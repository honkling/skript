package me.honkling.skriptkt.common.output

import java.io.File

class Warning(
    file: File,
    start: Int,
    message: String
) : LocatedOutput(OutputType.WARNING, file, start, message)
