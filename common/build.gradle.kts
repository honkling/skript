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
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.20")
}

kotlin {
    jvmToolchain(17)
}

tasks.withType(Jar::class) {
    manifest {
        attributes["Main-Class"] = "me.honkling.skriptkt.common.MainKt"
    }
}