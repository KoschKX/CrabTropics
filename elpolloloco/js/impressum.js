document.addEventListener('DOMContentLoaded', function() {
    init();
    fade_in();
});

function init() {

    window.addEventListener('blur', () => {});

    window.addEventListener('focus', () => {});

    window.addEventListener('resize', function() {
        setAppWidth();
    });

    setAppWidth();

}

function fade_in(){
    let elm = document.querySelectorAll('body#impressum .fade_in');
    elm.forEach(function(felm){
        felm.classList.add('show');
    });
}

function setAppWidth(){
    let elm = document.querySelector('#holder .container');
    if(!elm){ return; }
    let cntW = elm.offsetWidth;
    let cntH = elm.offsetHeight;
    
    document.documentElement.style.setProperty('--app-width', cntW + 'px');
    document.documentElement.style.setProperty('--app-height', cntH + 'px');
}

