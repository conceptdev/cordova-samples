# Screen Helper Cordova plugin

## How To Use

```javascript
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    window.ScreenHelper.say(
        function(result) {
            alert("result = " + result);
        },
        function() {
            alert("error");
        }
    );
}
```
