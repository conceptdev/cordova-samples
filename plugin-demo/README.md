# Cordova Screen Helper plugin demo



## Basic setup

To create your own plugin demo app that minimally retrieves and displays device telemetry (including dual-screen info),
update the default Cordova template as shown below:

### Cordova configuration

```dotnetcli
cordova create plugin-demo co.conceptdev.plugindemo PluginDemo

cd plugin-demo

cordova platform add android

cordova plugin add cordova-plugin-screen-orientation

cordova run                # or cordova emulate, to test app works

cordova plugin add https://github.com/conceptdev/cordova-dualscreeninfo-plugin/

// setup html & js as below

cordova run                # or cordova emulate, to see dual-screen telemetry
```

### HTML

Add some `div` elements to the default HTML to show device information (`metrics`, `orientation`, `dualscreen`, `hinge`):

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover">
        <meta name="color-scheme" content="light dark">
        <link rel="stylesheet" href="css/index.css">
        <title>Hello World</title>
    </head>
    <body>
        <div class="app">
            <h1>Apache Cordova</h1>
            <div id="deviceready" class="blink">
                <p class="event listening">Connecting to Device</p>
                <p class="event received">Device is Ready</p>
            </div>
            <div id="metrics"><p>...</p></div>
            <div id="orientation"><p>...</p></div>
            <div id="dualscreen"><p>...</p></div>
            <div id="hinge"><p>...</p></div>
            <button onclick="clickHandler();">Click me</button>
        </div>
        <script src="cordova.js"></script>
        <script src="js/index.js"></script>
    </body>
</html>

```

### JavaScript

Edit the **js/index.js** file to handle the `resize` event, and display screen information from the `orientation` and `dualscreeninfo` plugins:

```javascript
// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
window.addEventListener('resize', onResize, true);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (initial)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' (initial)';

    window.ScreenHelper.isDualScreenDevice(
        function(result) { document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + result; },
        function(error)  { document.getElementById('dualscreen').innerText = 'isSurfaceDuo: error ' + error; }
    );
}

function onResize() {
    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (after resize)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' (after resize)';

    window.ScreenHelper.getHinge(
        function(result) { document.getElementById('hinge').innerText = 'hinge: ' + result; },
        function(error)  { document.getElementById('hinge').innerText = 'hinge: error ' + error; }
    );
}

function clickHandler() {
    // used for debugging
}
```

See the source code in this sample for details on how to use these values to adjust the layout for dual-screen devices
(including adding a debug 'hinge' element to your page).

## Resources

- [Cordova dual-screen plugin repo](https://github.com/conceptdev/cordova-dualscreeninfo-plugin)
- [Surface Duo developer documentation](https://docs.microsoft.com/dual-screen/)
- [Surface Duo developer blog](https://devblogs.microsoft.com/surface-duo/)
