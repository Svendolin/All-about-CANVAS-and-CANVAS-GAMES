/* let myNumber: number = 12;
let myString: string = "SAE Zürich";  // any = Definition, die "Es kann alles sein" bedeutet
let myBoolean: boolean = false;

let result: number = myNumber * parseInt(myString); //Die parseInt() Methode liest ein String-Argument ein und gibt eine ganze Zahl im angegebenen Zahlensystem zurück
*/

class Bankkonto {
  private saldo: number = 0;  // Default status = public , d.h man kann auch extern darauf zugreifen
  inhaber: string = ""; 
  iban: string = ""; // default leer, gibt uns undefined

  geldEinzahlen(geldbetrag: number): void {  // Default: Kein Rückgabewert
    if (geldbetrag >= 0) {
    this.saldo += geldbetrag;
    }
  }

  geldAbheben(geldbetrag: number): number {
      if (this.saldo >= geldbetrag) {
        this.saldo -= geldbetrag;
        return geldbetrag;
      }
      else {
        alert("Saldo zu tief!");
        // Info per SMS...
        return -1;
      }
  }

  getSaldo(): number {
    return this.saldo;
  }

}

// Mittels "extends" vererben wir die Eigenschaften. Wir erhalten die Grundklasse Bankkonto, aber können diese erweitern
class Privatkonto extends Bankkonto {
  zins: number = 0.01;

  rabattErhalten(){
    console.log("Rabatt gewährt!")
  }

}

class Sparkonto extends Bankkonto {
  zins: number = 0.1;
  
}

let kontoPersonA: Privatkonto = new Privatkonto(); // new() = neue Instanz
let kontoPersonB: Sparkonto = new Sparkonto();

kontoPersonA.geldEinzahlen(200);
kontoPersonB.geldEinzahlen(300);
kontoPersonA.geldAbheben(400);

console.log(kontoPersonA.getSaldo());
console.log(kontoPersonB.getSaldo());