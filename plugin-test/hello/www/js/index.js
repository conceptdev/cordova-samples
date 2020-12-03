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
            var h = new Hinge (result);
            document.getElementById('hinge').innerText = 'Spanned: ' + h.isSpanned; 

            if (h.isSpanned) {
                document.getElementById('hinge').innerText += ' hinge: ' + h.toString();
                document.getElementById('debughinge').classList.remove('single');
                document.getElementById('debughinge').classList.add('spanned');

                // document.getElementById('debughinge').setAttribute('left', h.x);
                // document.getElementById('debughinge').setAttribute('top', h.y);
            } else {
                document.getElementById('debughinge').classList.remove('spanned');
                document.getElementById('debughinge').classList.add('single');
            } 
        },
        function(error) {  document.getElementById('hinge').innerText = ' hinge: error ' + error; }
    );
}


function Hinge(dimString) {
    this.isSpanned = ('0,0,0,0' != dimString);

    var arrayOfDims = dimString.split(',');
    this.x = arrayOfDims[0] / 2.5;
    this.y = arrayOfDims[1] / 2.5;
    this.width = arrayOfDims[2] / 2.5;
    this.height = arrayOfDims[3] / 2.5;

    this.isVertical = (this.x > 0);
    this.isHorizontal = (this.x == 0);
}
Hinge.prototype.toString = function() {
    return this.x + ',' + this.y + '-' + this.width + ',' + this.height;
}
Hinge.prototype.setDimensions = function(div) {
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
}

function clickHandler() {
    
    window.ScreenHelper.getHinge(
        function(result) { 
            // alert("hinge: " + result); 
            //alert('0,0,0,0' == result);
            var h = new Hinge (result);
            //alert('isSpanned: ' + h.isSpanned + ' ' + result);
            //alert ('x is '+ h.x);
            alert(h.x + 'px');
            h.setDimensions(document.getElementById('debughinge'));
            // document.getElementById('debughinge').style.left = h.x + 'px';
            // document.getElementById('debughinge').style.top = h.y + 'px';
            // document.getElementById('debughinge').style.width = h.width + 'px';
            // document.getElementById('debughinge').style.height = h.height + 'px';
            
        },
        function(error) { alert('error ' + error); }
    );

   // document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + answer + " (clicked)";
}
