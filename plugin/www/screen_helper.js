var ScreenHelper = function() {};

ScreenHelper.prototype.say = function(success, fail) {
    cordova.exec(success, fail, "ScreenHelperPlugin","say", []);
};

var screenHelper = new ScreenHelper();
module.exports = screenHelper;