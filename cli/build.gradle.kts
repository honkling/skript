plugins {
    application
    kotlin("jvm") version "1.9.20"
    id("com.github.johnrengelman.shadow") version "8.0.0"
}

group = "me.honkling.skriptkt"
version = "0.1.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.github.ajalt.clikt:clikt:4.2.2")
    implementation(project(":common")) {
        exclude(group = "org.jetbrains.kotlin")
    }
}

kotlin {
    jvmToolchain(17)
}

application {
    mainClass.set("me.honkling.skriptkt.cli.MainKt")
}