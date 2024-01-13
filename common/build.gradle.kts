plugins {
    kotlin("jvm") version "1.9.20"
    id("com.github.johnrengelman.shadow") version "8.1.0"
}

group = "me.honkling.skriptkt.common"
version = "0.1.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
}

kotlin {
    jvmToolchain(17)
}

tasks.withType(Jar::class) {
    manifest {
        attributes["Main-Class"] = "me.honkling.skriptkt.common.MainKt"
    }
}