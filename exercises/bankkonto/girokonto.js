class Girokonto extends Bankkonto {

  constructor(benutzer, kontostand, zinsen) {
    super(benutzer, kontostand, zinsen);
  }

  ueberweisen(kontoB,amount) {
    if (amount <= 0 || amount>this.kontostand) { return; } // Amount is 0 or Negative or Not enough Funds.
    if (!kontoB) { return; } // Account doesn't exist.
    
    this.auszahlen(amount); kontoB.einzahlen(amount);
  }

}