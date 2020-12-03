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

    // we don't query for the hinge in onDeviceReady because Surface Duo apps currently 
    // ALWAYS start on a single screen, so the onResize even will occur before the app is spanned
}
/* every time the screen resizes we check the hinge dimensions to see if app has spanned/unspanned or rotated */
function onResize() {
    document.getElementById('metrics').innerText = window.innerWidth + ' x ' + window.innerHeight + ' (after resize)';

    document.getElementById('orientation').innerText = screen.orientation.type + ' ' + screen.orientation.angle +  ' (after resize)';

    window.ScreenHelper.getHinge(
        function(result) { 
            var h = new Hinge (result);
            document.getElementById('hinge').innerText = 'Spanned: ' + h.isSpanned; 

            if (h.isSpanned) {
                document.getElementById('hinge').innerText += ' hinge: ' + h.toString();
                // show the debug hinge visualization, and size it correctly for the orientation
                document.getElementById('debughinge').classList.remove('single');
                document.getElementById('debughinge').classList.add('spanned');
                h.setDimensions(document.getElementById('debughinge'));

                if (h.isVertical) { // move the app content to the left
                    document.getElementsByClassName("app")[0].style.left = '25%';
                    document.getElementsByClassName("app")[0].style.top = '50%';
                } else { // isHorizontal
                    document.getElementsByClassName("app")[0].style.left = '50%';
                    document.getElementsByClassName("app")[0].style.top = '25%';
                }
            } else { // NOT spanned
                // hide the debug hinge visualization
                document.getElementById('debughinge').classList.remove('spanned');
                document.getElementById('debughinge').classList.add('single');

                // reset the app container style
                document.getElementsByClassName("app")[0].style.left = '50%';
                document.getElementsByClassName("app")[0].style.top = '50%';
            } 
        },
        function(error) {  document.getElementById('hinge').innerText = 'hinge: error ' + error; }
    );
}

/* Hinge object to encapsulate dimensions and display handling */
function Hinge(dimString) {
    this.isSpanned = ('0,0,0,0' != dimString.substring(0,7)); // no hinge present means not spanned
    const densityFactor = 2.5; // hardcoded for Surface Duo
    var arrayOfDims = dimString.split(',');
    this.x = arrayOfDims[0] / densityFactor;
    this.y = arrayOfDims[1] / densityFactor;
    this.width = arrayOfDims[2] / densityFactor;
    this.height = arrayOfDims[3] / densityFactor;
    this.statusBarHeight = arrayOfDims[4] / densityFactor;

    this.isVertical = (this.x > 0);
    this.isHorizontal = (this.x == 0);
}
/* @return dimensions of the display mask area in dp (left, top, width, height) */
Hinge.prototype.toString = function() {
    return this.x + ',' + this.y + '-' + this.width + ',' + this.height;
}
/* sets the top, left, width, height properties of the DIV passed to the function */
Hinge.prototype.setDimensions = function(div, debug) {
    var debugAdjustment = 0;
    if (debug) debugAdjustment = 8;
    if (this.isHorizontal) {
        div.style.left = this.x + 'px';
        // status bar pushes the Cordova viewport down, adjust the hinge position up to account for this
        div.style.top = (this.y - this.statusBarHeight - debugAdjustment) + 'px';
        div.style.width = this.width + 'px';
        div.style.height = (this.height + debugAdjustment + debugAdjustment) + 'px';
    } else { // isVertical
        div.style.left = (this.x - debugAdjustment) + 'px';
        div.style.top = this.y + 'px';
        div.style.width = (this.width + debugAdjustment + debugAdjustment) + 'px';
        div.style.height = this.height + 'px';
    }
    // note that the navigation bar at the bottom (vertical) or right-side (horizontal)
    // also affects the height/width of the display mask, but we aren't currently accounting
    // for that, and instead just size the element off the viewport edge.
}

function clickHandler() {
    // window.ScreenHelper.getStatusBarHeight (
    //     function(result) { alert('status bar: ' + result);    },
    //     function(error) { alert('error ' + error); }
    // );
    window.ScreenHelper.getHinge(
        function(result) { 
            var h = new Hinge (result);
            if (h.isSpanned)
                h.setDimensions(document.getElementById('debughinge'), true);
            else
                alert("not spanned, no hinge to debug");
        },
        function(error) { alert('error ' + error); }
    );
   // document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + answer + " (clicked)";
}
