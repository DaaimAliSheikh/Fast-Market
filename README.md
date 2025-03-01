# Welcome to FAST MARKET

### Key store setup with react-native-firebase and google OAuth:

- To create the android and ios folders `npx expo prebuild`

- In `/android/app/`

  - debug.keystore (default to be used, but also have to be copied to /home/daaim/.android/ folder)
  - my-upload-key.keystore (to be created)

- Creating the release my-upload-key.keystore:
  `keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`

- Setup up variables in `/android/gradle.properties`:

  ```MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=123456
   MYAPP_UPLOAD_KEY_PASSWORD=123456

  ```

- Modify `/android/app/build.gradle`:

  ```
  // For smaller build sizes set/modify these two configurations:
  def enableProguardInReleaseBuilds = true
  def enableSeparateBuildPerCPUArchitecture = true


  signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }

        //// add below config
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file('./my-upload-key.keystore')
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
  buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release  ///changed this to release

            ///for reduced size, these two properties
            minifyEnabled true
            shrinkResources true

            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            crunchPngs (findProperty('android.enablePngCrunchInReleaseBuilds')?.toBoolean() ?: true)
        }
    }
  ```

- To get SHA-1 and SHA-256 keys for both release and debug builds:

  `cd android && ./gradlew signingReport`

- Firebase console setup:

  - Create android app
  - Add all SHA keys(debug and release, SHA-1 and SHA-256) and download the google-services.json file and place it in `root` of your project,
    and add also it to .gitignore
  - In app.json:

  ```
  "android": {
     "adaptiveIcon": {
       "foregroundImage": "./assets/images/adaptive-icon.png",
       "backgroundColor": "#ffffff"
     },
     "package": "com.daaimali.fastmarket",
     "googleServicesFile": "./google-services.json"
   },

  ```

### Building the application

- Optimized release verison
  `npx expo run:android --variant release`

- Debug version with live reload: `npx expo run:android`
  - Connect real device via USB
  - Enable developer mode on the device
  - Enable USB debugging, and select File transfer mode when prompted
