/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('resize', onResize, true);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (initial)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' (initial)';

    document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ?';
}

function onResize() {
    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (after resize)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' (after resize)';

    var answer = '?';

    window.ScreenHelper.say(
        function(result) { answer = result; },
        function(error) { answer = 'error ' + error; }
    );

    document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + answer;
}

function clickHandler() {
    
    //document.getElementById('orientation').innerText = 'button clicked';

    var answer = 'X';

    window.ScreenHelper.isDualScreenDevice(
        function(result) { alert( "success: " + result ); answer = result; },
        function(error) { alert( "error: " + error ); }
    );

    var answer = 'Y';

    document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + answer;
}
