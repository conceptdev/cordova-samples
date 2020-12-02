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
        Log.d(TAG, "execute action: " + action);
        
        // Route the Action
        if (action.equals("say")) {
            callbackContext.success("Hello ScreenHelper!" + isDeviceSurfaceDuo());
            return true;
        }
        if (action.equals("isDualScreenDevice")) {
            this.cordova.getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    callbackContext.success(""+isDeviceSurfaceDuo()); // Thread-safe.
                }
            });
            //callbackContext.success(""+isDeviceSurfaceDuo());
            return true;
        }

        // Action not found
        callbackContext.error("action "+action+" not recognized");
        return false;
    }

    static final String TAG = "ScreenHelperCordovaPlugin";

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
