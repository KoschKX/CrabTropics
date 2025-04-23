var konten = [];
let liste_konten;
let curr_konto = '';

document.addEventListener("DOMContentLoaded", function () {

    let field_benutzer = document.querySelector('#benutzer');
    let field_beitrag = document.querySelector('#beitrag');
    let button_einstellen = document.querySelector('#einstellen');
    let button_einzahlen = document.querySelector('#einzahlen');
    let button_auszahlen = document.querySelector('#auszahlen');
    let button_abfragen = document.querySelector('#abfragen');

    liste_konten = document.querySelector('#konten');

    curr_konto = field_beitrag.value;
    curr_beitrag = liste_konten.value;

    liste_konten.addEventListener('change', function() {
      if(liste_konten.value!=''){
        curr_konto = liste_konten.value;
        updateKontoDisplay(curr_konto);
      }
    });

    field_beitrag.addEventListener('change', function() {
        curr_beitrag = this.value;
    });

    button_einstellen.addEventListener('click', function() {
      kontocall(field_beitrag.value, 'einstellen', beitrag);
      liste_konten.value = field_beitrag.value;
      curr_konto =field_beitrag.value;
      field_beitrag.value = '';
    });

    button_einzahlen.addEventListener('click', function() {
      kontocall(curr_konto, 'einzahlen', curr_beitrag);
    });

    button_auszahlen.addEventListener('click', function() {
      kontocall(curr_konto, 'auszahlen', curr_beitrag);
    });

    button_abfragen.addEventListener('click', function() {
      kontocall(curr_konto, 'abfragen');
    });

});

function kontocall(konto, action, beitrag){
  let ckonto = konten[konto];
  if(ckonto || action == 'einstellen'){

    let box_msg = document.querySelector('#msg');

    let date = new Date();
        date = date.toLocaleString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

    let tagline = '['+date+']'+' | '+'['+konto+']';

    let msg='';

    if(
      action!='einstellen' &&
      action!='abfragen' &&
      isNaN(beitrag))
    {
      msg+='Das ist kein numerischer Wert.'; 
    }else{

      if(!isNaN(parseFloat(beitrag))){
        console.log(beitrag);
        beitrag=parseFloat(beitrag);
      }

      switch(action){
        case 'einstellen':
          liste_konten.innerHTML += '<option value="'+konto+'">'+konto+'</option>';
          konten[konto]=new Bankkonto(konto,0);
          msg='Neues Konto eingestelt';
          break; 
        case 'einzahlen':
          ckonto.einzahlen(beitrag);
          msg+='€'+beitrag+' auf konto eingezahlt';
          if(beitrag>1999.99){ 
            msg+=+'\n'+'(That\'s a lot of cheeze!)';
          }
          break;
        case 'auszahlen':
          ckonto.auszahlen(beitrag);
          msg+='€'+beitrag+' vom konto abgehoben';
          break;
        case 'abfragen':
          let amt = ckonto.abfragen();
          msg+='Kontostand : '+'€'+parseFloat(amt),toFixed(2);
          break;
      }
    }

    updateKontoDisplay(konto);

    box_msg.innerHTML+=tagline+'\n';
    box_msg.innerHTML+=msg;
    box_msg.innerHTML+= '\n---\n';
    box_msg.innerHTML+= '\n';

 };  
}

 function updateKontoDisplay(konto){
    let ckonto = konten[konto];
    if(ckonto){
      let amt = ckonto.abfragen();
      let box_kst = document.querySelector('#kontostand');
      box_kst.innerHTML='€'+parseFloat(amt).toFixed(2);
    }
 }