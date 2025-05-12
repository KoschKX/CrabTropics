/* ------------------ GLOBAL UTILITIES ------------------ */

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
        console.log('Destroyed ' + object.name);
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
                console.log(`Instance of ${className}`);
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
    ctx.fillText(text, x, y);
    if (ocolor) {
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = ocolor;
        ctx.strokeText(text, x, y);
    }
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