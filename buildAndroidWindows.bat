echo 'Deleting old APK...'
del sageone.apk
cd "platforms/android/build/outputs/apk"
del android-release-unsigned.apk
cd..
cd..
cd..
cd..
cd..
echo 'Starting Phonegap build...'
call phonegap build android --release -d
echo 'Signing release APK...'
call "%JAVA_HOME%\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore key.jks -storepass abc12345 "platforms/android/build/outputs/apk/android-release-unsigned.apk" Phonegap
call "%ANDROID_HOME%\build-tools\22.0.1\zipalign.exe" -v 4 "platforms/android/build/outputs/apk/android-release-unsigned.apk" Showcase-Phonegap.apk
echo 'Finished :)'
pause