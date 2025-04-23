class Bankkonto {

  constructor(benutzer, kontostand = 0, zinsen = 2.64) {
    this.benutzer = benutzer;
    this.kontostand = kontostand;
    this.zinsen = zinsen; 
    this.transactions = [];
    this.recordTransaction('New Account', kontostand);
  }

  einzahlen(amount) {
    if (amount <= 0) { return; }
    this.kontostand += amount;
    this.recordTransaction('deposit', amount);
  }

  auszahlen(amount) {
    if (amount <= 0) { return; }
    this.kontostand -= amount;
    this.recordTransaction('withdrawal', -amount);
  }

  abfragen() {
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
  }

}