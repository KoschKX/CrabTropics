
document.addEventListener('DOMContentLoaded', function() {
    init();
});


function init() {

    window.addEventListener('blur', () => {

    });

    window.addEventListener('focus', () => {

    });

    window.addEventListener('resize', function() {
        setAppWidth();
    });

    setAppWidth();

}

function setAppWidth(){
    let elm = document.querySelector('#holder .container');
    if(!elm){ return; }
    let cntW = elm.offsetWidth;
    let cntH = elm.offsetHeight;
    
    document.documentElement.style.setProperty('--app-width', cntW + 'px');
    document.documentElement.style.setProperty('--app-height', cntH + 'px');
}

