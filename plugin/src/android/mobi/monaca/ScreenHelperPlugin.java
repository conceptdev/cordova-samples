package mobi.monaca;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.util.Log;
/**
 * This class echoes a string called from JavaScript.
 */
public class ScreenHelperPlugin extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        callbackContext.success("Hello ScreenHelper!" + isDeviceSurfaceDuo());
        return true;
    }

    static final String TAG = "ScreenHelper";
    
    private boolean isDeviceSurfaceDuo(){
        String feature = "com.microsoft.device.display.displaymask";
        Activity activity = this.cordova.getActivity();
        PackageManager pm = activity.getPackageManager();

        if (pm.hasSystemFeature(feature)) {
            Log.i(TAG, "System has feature: " + feature);
            return true;
        } else {
            Log.w(TAG, "System missing feature: " + feature);
            return false;
        }
    }
}
