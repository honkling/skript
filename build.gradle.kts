plugins {
    java
    kotlin("jvm") version "1.9.20"
}

repositories {
    mavenCentral()
}

group = "me.honkling.skriptkt"
version = "0.1.0"

subprojects {
    apply(plugin = "java")
}
