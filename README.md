# How to run this stuff

Install NodeJS
https://nodejs.org/en/download/current/

For this to work properly you'll need a local version of DHIS2 or point the navigate to the demo or dev servers (https://play.dhis2.org/demo or https://play.dhis2.org/dev)
We have tested with dev server, and it works. We can not guarantee that other servers have the same functionality.
If you want to run it against either of these you will need to set up the server to accept CORS requests from http://localhost:8081
You can do this by adding `http://localhost:8081` to the CORS Whitelist in the System Settings App.

- Open dhis2
- Go to System Settings (from the menu)
- Click the access tab
- Add `http://localhost:8081` to the CORS Whitelist

Manual
------
Click on a polygon to select it and zoom. 
Click on a marker to show info and enable editing. 
Click on "new" to create a new organisation unit. Click on map to select location. This functionality only works for level 3.
Right click to zoom out to parent. 

Dependencies:
-------------
* Node
* babel
* express
* material-ui
* react
* react-hot-loader
* react-google-maps
* webpack
* webpack-dev-middleware
* webpack-hot-middleware

Setup:
---
```
npm install
```

Run:
----
```
npm start
```

Compile:
--------

```
npm run compile
```
