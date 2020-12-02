var ScreenHelper = function() {};

ScreenHelper.prototype.say = function(success, fail) {
    cordova.exec(success, fail, "ScreenHelperPlugin","say", []);
};

ScreenHelper.prototype.isDualScreenDevice = function(success, fail) {
    cordova.exec(success, fail, "ScreenHelperPlugin","isDualScreenDevice", []);
};

var screenHelper = new ScreenHelper();
module.exports = screenHelper;