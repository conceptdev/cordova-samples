# Screen Helper PhoneGap plugin

## How To Use

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