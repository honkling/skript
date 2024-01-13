package me.honkling.skriptkt.common

import me.honkling.skriptkt.common.lib.getClassesInPackage
import me.honkling.skriptkt.common.syntax.SyntaxElement

open class SkriptAddon {
    @Suppress("UNCHECKED_CAST")
    fun registerSyntax(basePackage: String, vararg packages: String) {
        for (subpackage in packages) {
            val pkg = "$basePackage.$subpackage"
            val classes = getClassesInPackage(this::class.java, pkg, ::isSyntaxElement) as List<Class<out SyntaxElement>>

            classes.forEach(Skript.syntaxRegistry::register)
        }
    }

    private fun isSyntaxElement(clazz: Class<*>): Boolean {
        val syntaxElement = SyntaxElement::class.java
        return syntaxElement.isAssignableFrom(clazz)
    }
}