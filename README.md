# Showcase PhoneGap - Cross Platform Mobile Development
Showcase and example of mobile application development using PhoneGap/Cordova.

### Installation
  $ Install NodeJs (Tested with v4 above)
  $ npm install phonegap -g
  
	$ cd [to parent folder]
	$ git clone https://github.com/daniel-prinsloo/Showcase-MobileApp-PhoneGap.git
	$ cd Showcase-MobileApp-PhoneGap
	$ npm install
	$ bower install
	$ gulp setup:phoegap:android (or later gulp setup:phoegap:ios)
    (Runs $ phonegap platform add android/ios -d)

### Build to Phone with Plugins
  
	$ phonegap run [ios/android] --device -d
	Or run buildAndroidWindows.bat (Contains example of using key file to sign release apk)
    
### Serve to Browser (src folder)

  $ gulp
    
### Build production version to www folder

  $ gulp build
    
### Serve production build 

    $ gulp serve:build
    
### To include source maps with all build tasks add --sourcemaps

    Example $ gulp build --sourcemaps

### Analyse source code, html validation and eslint 

    $ gulp analyse
    
### Used to verify that the development version is working correctly in www folder

    $ gulp serve:build:debug
    
### Run this command to re-add plugins 

    $ gulp add-plugins

### Serve to PhoneGap Developer App (Download from iStore/Play Store)
    
  $ gulp build
	$ phonegap serve
[Enter IP from console into PhoneGap Developer App]

###Phonegap Plugins
none as of yet
