function random(min, max) {
    return min + Math.random() * (max - min);
}
    
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function destroy(object, arr=[], world){
    if(!arr){ return; }
    let removals = arr.find(obj => obj.stamp === object.stamp);
    arr = arr.filter(obj => obj !== removals);
    if(removals && world.debug){
        console.log( 'Destroyed '+object.name);
    }
    return arr;
}

function concat(arr){
    if(!arr || !arr.length){ return []; }
    let out=[];
    arr.forEach((a) => { out = out.concat(a); });
    return out;
}

function getQueryString(prms){
    const params = new URLSearchParams(window.location.search);
    return params;
}

function createNamedClass(className) {
  return {
    [className]: class {
      constructor() {
        console.log(`Instance of ${className}`);
      }
    }
  }[className];
}

/* GRAPHICS */

function drawRect(ctx,x,y,w,h,color,ocolor,othick=1){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    if(ocolor){ 
      ctx.strokeStyle = ocolor; 
      ctx.lineWidth = othick; 
      ctx.strokeRect(x,y,w,h);
    }
  }

function drawText(ctx,x,y,w,h,text,color,font,align,baseline,ocolor,othick=1){
    ctx.fillStyle = color;
    ctx.font = font; 
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText( text, x, y);
    if(ocolor){ 
      ctx.fillStyle = ocolor;
      ctx.strokeText( text, x, y);
    }
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }
  const bint = parseInt(hex, 16);
  return {
    r: (bint >> 16) & 255, g: (bint >> 8) & 255, b: bint & 255
  };
}

function colorToHex(color) {
  const ctx = document.createElement("canvas").getContext("2d"); ctx.fillStyle = color;
  const computed = ctx.fillStyle;
  if (computed.startsWith("#")) return computed;
  const rgb = computed.match(/\d+/g);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  return (
    "#" + [r, g, b] .map(x => parseInt(x).toString(16).padStart(2, "0")).join("")
  );
}

function cutFrames(frames,cut){
    return Array.from({ length: Math.floor((frames - cut) / cut) + 1 }, (_, i) => (i + 1) * cut);
}