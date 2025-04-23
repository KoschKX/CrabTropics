class Bankkonto {

  constructor(benutzer, kontostand = 0, zinsen = 2.64) {
    this.benutzer = benutzer;
    this.kontostand = kontostand;
    this.zinsen = zinsen; 
    this.transactions = [];
    this.recordTransaction('New Account', kontostand);
  }

  einzahlen(amount) {
    if (amount <= 0) {
      console.log('Deposit must be positive.');
      return;
    }

    this.kontostand += amount;

    this.recordTransaction('deposit', amount);
  }

  auszahlen(amount) {
    if (amount <= 0) { console.log('Withdrawal must be positive.'); return; }
    if (amount > this.kontostand) { console.log('Nah man, you\'re too broke.'); return; }

    this.kontostand -= amount;

    this.recordTransaction('withdrawal', -amount);
  }

  abfragen() {
    console.log('Account status for '+ this.benutzer +': €'+ this.kontostand.toFixed(2));
    return this.kontostand;
  }

  einhalteZinsen() {
    /* ??? */
    console.log('Wut is it supposed to do?');
  }

  recordTransaction(action, amount) {
    const zeit = new Date();
    this.transactions.push({
      action,
      amount,
      kontostand: this.kontostand,
      zeit
    });

    switch(action){
      case 'deposit': 
        if(amount>1999.99){
          console.log('That\'s the real cheeez, man.');
        }else{
          console.log('More muny.');
        }
        break;
      case 'withdrawal':
        if(amount>2000){
          console.log('Gotta pay dem bills.');
        }
        break;
    }
  }

}