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
window.addEventListener('resize', onResize, true);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (initial)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' (initial)';

    document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ?';

    document.getElementById('hinge').innerText = 'not spanned, no hinge';

    window.ScreenHelper.isDualScreenDevice(
        function(result) { document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + result; },
        function(error) {  document.getElementById('dualscreen').innerText = 'isSurfaceDuo: error ' + error; }
    );
}

function onResize() {
    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (after resize)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' ' + screen.orientation.angle +  ' (after resize)';

    window.ScreenHelper.getHinge(
        function(result) { 
            document.getElementById('hinge').innerText = result; 

            if ('0,0,0,0' == result) {
                document.getElementById('hinge').innerText = 'not spanned, no hinge';
                document.getElementById('debughinge').classList.remove('spanned');
                document.getElementById('debughinge').classList.add('single');
            } else {
                document.getElementById('hinge').innerText = 'hinge: ' + result;
                document.getElementById('debughinge').classList.remove('single');
                document.getElementById('debughinge').classList.add('spanned');
            }
        },
        function(error) {  document.getElementById('hinge').innerText = 'hinge: error ' + error; }
    );
}

function clickHandler() {
    
    window.ScreenHelper.getHinge(
        function(result) { 
            // alert("hinge: " + result); 
            alert('0,0,0,0' == result);
        },
        function(error) { alert('error ' + error); }
    );

   // document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + answer + " (clicked)";
}
