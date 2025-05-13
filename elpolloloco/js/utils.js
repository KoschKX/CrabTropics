/* ------------------ GLOBAL UTILITIES ------------------ */

/** 
 * Log here instead.
 */
function log(msg, delay=3000, hide=true){
    let consolebox = document.querySelector('#console');
    if(consolebox){
        let hover = document.querySelector('#console:hover');
        let now      = new Date();
        let hours    = now.getHours().toString().padStart(2, '0');
        let minutes  = now.getMinutes().toString().padStart(2, '0');
        let seconds  = now.getSeconds().toString().padStart(2, '0'); 
        let stamp    = hours+':'+minutes+':'+seconds;
        let logentry = document.createElement('div');
            logentry.classList.add('log_entry');
            logentry.setAttribute('stamp',stamp);
            logentry.innerHTML=msg+'<span class="log_stamp">'+stamp+'</span>';
        consolebox.appendChild(logentry);
        if(!hover){ consolebox.scrollTop = consolebox.scrollHeight; }
        setTimeout(() => {
            logentry.classList.add('show');
            logentry.classList.remove('hide');
            setTimeout(() => {
                logentry.classList.remove('show');
                setTimeout(() => {
                    logentry.classList.remove('hide');
                }, 1000);
            }, delay);
        }, 0);
        consolebox.addEventListener('mouseleave', (e) => { consolebox.scrollTop = consolebox.scrollHeight; });
    }
}

/** 
 * Detects browser and plaformn and adds the appropriate attributes to the body.
 */
function detect_browser(){
    let brw = '';
    let pfm = '';
    let mbl = false; 

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        mbl = true;
    }

    if(navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1){
        brw = "safari";
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
        brw ="ie";
    } else if(navigator.userAgent.indexOf("Chrome") != -1) {
        brw ="chrome";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        brw ="firefox";
    } else {
        brw = "unknown";
    }

    if (navigator.userAgentData && navigator.userAgentData.platform) {
        pfm = navigator.userAgentData.platform.toLowerCase();
    } else {
        pfm = navigator.platform ? navigator.platform.toLowerCase() : "unknown";
    }

    const isIpad = pfm === 'macintel' && navigator.maxTouchPoints > 1;
    if (isIpad) { pfm = 'ipad';}

    document.querySelector('body').setAttribute('data-browser',brw);
    document.querySelector('body').setAttribute('data-mobile',mbl);
    document.querySelector('body').setAttribute('data-platform',pfm);
}


/** 
 * Checks an Array of paths for formats for a specific format.
 */
function checkFormat(fArr, fmt){
    let found;
    if (Array.isArray(fArr) && fArr.length > 1) {
        for(let f = 0; f<fArr.length; f++){
            const ext = fArr[f].split('.').pop();
            if(ext==fmt){
                found = fArr[f];
            }
        }
    }
    return found;
}

/** 
 * Removes a specific object from an array based on a matching `stamp` property.
 * Optionally logs the removal if `world.debug` is enabled.
 *
 * @param {Object} object - The object to destroy.
 * @param {Object[]} arr - The array of objects.
 * @param {Object} world - The world context (used for debug logging).
 * @returns {Object[]} The updated array with the object removed.
 */
function destroy(object, arr = [], world) {
    if (!arr) return;
    let removals = arr.find(obj => obj.stamp === object.stamp);
    arr = arr.filter(obj => obj !== removals);
    if (removals && world?.debug) {
        log('Destroyed ' + object.name);
    }
    return arr;
}

/**
 * Flattens an array of arrays into a single array.
 *
 * @param {Array[]} arr - Array of arrays to concatenate.
 * @returns {Array} The flattened array.
 */
function concat(arr) {
    if (!arr || !arr.length) return [];
    let out = [];
    arr.forEach((a) => { out = out.concat(a); });
    return out;
}

/**
 * Returns a URLSearchParams object based on current window location.
 *
 * @param {any} prms - (Unused) Reserved for future functionality.
 * @returns {URLSearchParams} Parsed query parameters.
 */
function getQueryString(prms) {
    const params = new URLSearchParams(window.location.search);
    return params;
}

/**
 * Dynamically creates a class with a specific name.
 *
 * @param {string} className - The name of the class to create.
 * @returns {Function} A new class constructor function.
 */
function createNamedClass(className) {
    return {
        [className]: class {
            constructor() {
                log(`Instance of ${className}`);
            }
        }
    }[className];
}

/* ------------------ MATH ------------------ */

/**
 * Returns a random float between `min` and `max`.
 *
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Random float between min and max.
 */
function random(min, max) {
    return min + Math.random() * (max - min);
}

/**
 * Returns a random integer between `min` and `max` (inclusive).
 *
 * @param {number} min - Minimum integer.
 * @param {number} max - Maximum integer.
 * @returns {number} Random integer.
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns true with the given percent chance.
 *
 * @param {number} percent - A value between 0 and 100 representing the probability.
 * @returns {boolean} True if random chance succeeds.
 */
function rollChance(percent) {
    return Math.random() < (percent / 100);
}

/* ------------------ GRAPHICS ------------------ */

/**
 * Draws a filled rectangle (and optional stroke) on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} w - Width of the rectangle.
 * @param {number} h - Height of the rectangle.
 * @param {string} color - Fill color.
 * @param {string} [ocolor] - Optional stroke color.
 * @param {number} [othick=1] - Stroke thickness.
 */
function drawRect(ctx, x, y, w, h, color, ocolor, othick = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    if (ocolor) {
        ctx.strokeStyle = ocolor;
        ctx.lineWidth = othick;
        ctx.strokeRect(x, y, w, h);
    }
}

/**
 * Draws text on the canvas with optional stroke.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} w - Width constraint (unused).
 * @param {number} h - Height constraint (unused).
 * @param {string} text - Text to draw.
 * @param {string} color - Fill color.
 * @param {string} font - Font definition (e.g., "16px Arial").
 * @param {CanvasTextAlign} align - Text alignment ("left", "center", "right").
 * @param {CanvasTextBaseline} baseline - Text baseline ("top", "middle", "bottom", etc.).
 * @param {string} [ocolor] - Optional stroke color.
 * @param {number} [othick=1] - Stroke thickness.
 */
function drawText(ctx, x, y, w, h, text, color, font, align, baseline, ocolor, othick = 1) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.lineJoin = 'round';  // Smooth corners
    ctx.lineCap = 'round';  // Smooth ends of the stroke
    if (ocolor) {
        ctx.lineWidth = othick+3;
        ctx.fillStyle = ocolor;
        ctx.strokeStyle = ocolor;
        ctx.strokeText(text, x, y);
    } 
    ctx.lineWidth = 1;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

}

/**
 * Converts a hex color string to an RGB object.
 *
 * @param {string} hex - The hex color string (e.g., "#ff0000" or "f00").
 * @returns {{r: number, g: number, b: number}} An object with r, g, b components.
 */
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(ch => ch + ch).join('');
    }
    const bint = parseInt(hex, 16);
    return {
        r: (bint >> 16) & 255,
        g: (bint >> 8) & 255,
        b: bint & 255
    };
}

/**
 * Converts a CSS color string to a hex color.
 *
 * @param {string} color - Any valid CSS color string.
 * @returns {string|null} Hexadecimal color string or null if conversion fails.
 */
function colorToHex(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    const computed = ctx.fillStyle;
    if (computed.startsWith("#")) return computed;
    const rgb = computed.match(/\d+/g);
    if (!rgb) return null;
    const [r, g, b] = rgb;
    return (
        "#" + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, "0")).join("")
    );
}

/**
 * Generates an array of frame numbers that are spaced by a cut interval.
 *
 * @param {number} frames - Total number of frames.
 * @param {number} cut - Spacing between frames.
 * @returns {number[]} Array of frame indices.
 */
function cutFrames(frames, cut) {
    return Array.from({ length: Math.floor((frames - cut) / cut) + 1 }, (_, i) => (i + 1) * cut);
}