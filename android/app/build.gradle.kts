plugins {
    id("com.android.application")
}

android {
    namespace = "com.opusgame.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.opusgame.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 63
        versionName = "5.7-mod.63"
    }

    signingConfigs {
        create("opus") {
            storeFile = file("../opus-release.jks")
            storePassword = "opusgame"
            keyAlias = "opus"
            keyPassword = "opusgame"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("opus")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        buildConfig = false
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.12.0")
}
