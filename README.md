# Mapbox v3.7 Test on iOS in a Capacitor app

## Getting started

> If you have already installed dependencies from the main branch you may want to remove the node_modules directory and install again
> `rm -rf node_modules`

Clone the repository and have Node 18+ installed.

Install dependencies

`npm install`

Run the build

`npm run build`

Sync iOS app

`npx cap sync`

Open XCode

`npx cap open ios`

Run the application targetting an iOS device from XCode.

### Reproduction Steps

Once the app is loaded, select the first map "Dirty Sheets", once the map loads, change the style to Satellite by tapping the Satellite button.

Click the back button and load the second map "Peachtree Road Race", change to satellite view, then click the Back button.

Repeat these steps again until the you get the white screen and crash in XCode (for me it fails on the 3rd map load).

### Developing

`npm run dev`
