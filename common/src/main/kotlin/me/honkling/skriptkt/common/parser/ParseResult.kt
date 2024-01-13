package me.honkling.skriptkt.common.parser

import me.honkling.skriptkt.common.node.Node
import me.honkling.skriptkt.common.output.Error
import me.honkling.skriptkt.common.output.Warning
import me.honkling.skriptkt.common.statement.Statement
import java.io.File

data class ParseResult(
    val file: File,
    val errors: List<Error>,
    val warnings: List<Warning>,
    val statements: List<Statement>,
    val exportedSymbols: Map<String, Node>
)
