function random(min, max) {
    return min + Math.random() * (max - min);
}
    
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function destroy(object, arr=[]){
    if(!arr){ return; }
    let removals = arr.find(obj => obj.stamp === object.stamp);
    arr = arr.filter(obj => obj !== removals);
    if(removals && world.debug){
        console.log( 'Destroyed '+object.name);
    }
    return arr;
}

function concat(arr){
    let out=[];
    arr.forEach((a) => { out = out.concat(a); });
    return out;
}