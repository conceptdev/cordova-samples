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

    document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ?';
    document.getElementById('hinge').innerText = 'not spanned, no hinge';

    window.ScreenHelper.isDualScreenDevice(
        function(result) { document.getElementById('dualscreen').innerText = 'isSurfaceDuo: ' + result; },
        function(error) {  document.getElementById('dualscreen').innerText = 'isSurfaceDuo: error ' + error; }
    );
    updateSpanning();
}
/* every time the screen resizes we check the hinge dimensions to see if app has spanned/unspanned or rotated */
function onResize() {
    updateSpanning();
}
function updateSpanning() {
    window.ScreenHelper.getHinge(
        function(result) { 
            var h = new Hinge (result);
            document.getElementById('hinge').innerText = 'getHinge: ' + h.toString(); 
            if (h.isSpanned) {
                if (h.isVertical) {
                    window["__foldables_env_vars__"].update({spanning: 'single-fold-vertical', foldSize: parseInt(h.width)});
                } else { // isHorizontal
                    window["__foldables_env_vars__"].update({spanning: 'single-fold-horizontal', foldSize: parseInt(h.height)});
                }
            } else { // not spanned
                window["__foldables_env_vars__"].update({spanning: 'none', foldSize: 0});
            }
            
            // test JavaScript API
            const screens = window.getWindowSegments();
            document.getElementById('screens').innerText = 'screen 1: ' + screens[0].left + ',' + screens[0].top + '-' + screens[0].width + ',' + screens[0].height;
            if (screens[1]) 
                document.getElementById('screens').innerText += '\nscreen 2: ' + screens[1].left + ',' + screens[1].top + '-' + screens[1].width + ',' + screens[1].height;
            else
                document.getElementById('screens').innerText += '\n no screen 2'
            document.getElementById('screens').innerText += '\nwindow size:' + window.innerWidth +','+ window.innerHeight;
        },
        function(error) {  document.getElementById('hinge').innerText = 'getHinge: error ' + error; }
    );
}

/* Hinge object to encapsulate dimensions and display handling */
function Hinge(dimString) {
    this.isSpanned = ('0,0,0,0' != dimString.substring(0,7)); // no hinge present means not spanned
    var arrayOfDims = dimString.split(',');
    this.x = parseInt(arrayOfDims[0]);
    this.y = parseInt(arrayOfDims[1]);
    this.width = parseInt(arrayOfDims[2]);
    this.height = parseInt(arrayOfDims[3]);
    this.statusBarHeight = parseInt(arrayOfDims[4]);

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
}
