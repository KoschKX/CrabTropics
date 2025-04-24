class Sparkonto extends Bankkonto {

  zinsen = 1.64

  constructor(benutzer, kontostand = 0, zinsen = 1.64) {
    super(benutzer, kontostand);
    this.zinsen = zinsen;
  }

}