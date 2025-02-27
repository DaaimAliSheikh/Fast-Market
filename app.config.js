export default ({ config }) => ({

  ...config,
  "name": "fast-market",
    "slug": "fast-market",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.daaimali.fastmarket"
    },
    "android": {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.daaimali.fastmarket",
      "googleServicesFile": "./google-services.json"
    },
    "hooks": {
      "postPublish": [
        {
          "file": "expo-constants/scripts/get-google-services-json.js",
          "config": {
            "base64": "$(GOOGLE_SERVICES_JSON)"
          }
        }
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
     "@react-native-google-signin/google-signin",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "7d50b470-5711-4ad8-a9ec-bb3b4975b6b3"
      }
    }
  })

