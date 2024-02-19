pluginManagement {
    repositories {
        maven(url = "https://maven.fabricmc.net/")
        gradlePluginPortal()
    }
}

rootProject.name = "SkriptKt"
include("common", "fabric", "cli")
