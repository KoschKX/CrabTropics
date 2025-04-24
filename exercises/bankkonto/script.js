var konten = [];
let liste_konten;
let curr_konto = '';

document.addEventListener("DOMContentLoaded", function () {

    let field_eintrag = document.querySelector('#eintrag');
    let button_einstellen = document.querySelector('#einstellen');
    let button_einzahlen = document.querySelector('#einzahlen');
    let button_auszahlen = document.querySelector('#auszahlen');
    let button_abfragen = document.querySelector('#abfragen');
    let button_loeschen = document.querySelector('#clear');
    let box_msg = document.querySelector('#msg');

    liste_konten = document.querySelector('#konten');

    curr_konto = field_eintrag.value;
    curr_eintrag = liste_konten.value;

    liste_konten.addEventListener('change', function() {
      curr_konto = liste_konten.value;
      updateKontoDisplay(curr_konto);
    });

    field_eintrag.addEventListener('change', function() {
      curr_eintrag = this.value;
    });

    button_loeschen.addEventListener('click', function() {
      box_msg.innerHTML='';
    }); 


    button_einstellen.addEventListener('click', function() {
      if(!validateEntry() || !validateKontoEntry()){ return; }
      createKonto(field_eintrag.value);
      liste_konten.value = field_eintrag.value;
      curr_konto = field_eintrag.value;
      field_eintrag.value = '';
      curr_eintrag='';
    }); 

    button_einzahlen.addEventListener('click', function() {
      if(!validateKonto() || !validateEntry()){ return; }
      kontocall(curr_konto, 'einzahlen', curr_eintrag);
    });

    button_auszahlen.addEventListener('click', function() {
      if(!validateKonto() || !validateEntry()){ return; }
      kontocall(curr_konto, 'auszahlen', curr_eintrag);
    });

    button_abfragen.addEventListener('click', function() {
      if(!validateKonto()){ return; }
      kontocall(curr_konto, 'abfragen');
    });

});

function validateEntry(){
  if(curr_eintrag==''||curr_eintrag=='none'){ 
    log('Eintrag darf nicht leer sein.'); animateError(); return false; 
  }
  if(curr_eintrag<=0){ 
    log('Der Betrag muss positiv sein '); animateError(); return false; 
  }
  return true;
}

function validateKontoEntry(){
  if(/\d/.test(curr_eintrag)){
    log('Der Eintrag darf keine Zahlen enthalten.'); animateError(); return false; 
  }
  if(liste_konten.querySelector('option[value='+curr_eintrag+']')){ 
    log('Das Konto existiert bereits.'); animateError('konten'); return false;
  }
  return true;
}

function validateKonto(){
  if(!curr_konto||curr_konto==''){
    if(konten.length<=0){ 
      log('Bitte erstellen Sie ein Konto'); animateError(); animateError('einstellen'); return false; 
    }
  }
  if(!curr_konto||curr_konto=='none'||curr_konto==''){ 
    log('Wählen Sie bitte ein Konto aus.'); animateError('konten'); return false; 
  }
  return true;
}

function kontocall(konto, action, eintrag){
  let ckonto = konten[konto];
  if(ckonto){

    let msg='';

    if(isNaN(eintrag)&&action!='abfragen'){return;}

    if(!isNaN(parseFloat(eintrag))){
      eintrag=parseFloat(eintrag);
    }

    switch(action){
      case 'einzahlen':
        ckonto.einzahlen(eintrag);
        msg+='€'+eintrag+' auf konto eingezahlt';
        if(eintrag>1999.99){ 
          msg+='\n'+'(That\'s a lot of cheeze!)';
        }
        break;
      case 'auszahlen':
        ckonto.auszahlen(eintrag);
        msg+='€'+eintrag+' vom konto abgehoben';
        break;
      case 'abfragen':
        let amt = ckonto.abfragen();
        msg+='Kontostand : '+'€'+parseFloat(amt).toFixed(2);
        break;
    }

    updateKontoDisplay(konto);
    log(msg,konto);

 };  
}

function createKonto(konto){
  liste_konten.innerHTML += '<option value="'+konto+'">'+konto+'</option>';
  konten[konto]=new Bankkonto(konto,0);
  log('Neues Konto eingestelt',konto);
}

function formatDate(date){
  return date.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  });
}

function log(msg='',konto=''){
    let tagline;
    let box_msg = document.querySelector('#msg');
    let date = formatDate(new Date());
    if(konto==''){
      tagline = '['+date+']';
    }else{
      tagline = '['+date+']'+' | '+'['+konto+']'
    }
    box_msg.innerHTML+=tagline+'\n';
    box_msg.innerHTML+=msg;
    box_msg.innerHTML+= '\n---\n';
    box_msg.innerHTML+= '\n';
}

function updateKontoDisplay(konto){
    let ckonto = konten[konto];
    if(ckonto){
      let amt = ckonto.abfragen();
      let box_kst = document.querySelector('#kontostand');
      box_kst.innerHTML='€'+parseFloat(amt).toFixed(2);
    }
 }

 function animateError(trgt='eintrag'){
    document.getElementById(trgt).classList.add('animated');
    setTimeout( function(){
        document.getElementById(trgt).classList.remove('animated');
    },1000)
 }