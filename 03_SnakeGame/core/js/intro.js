/* let myNumber: number = 12;
let myString: string = "SAE Zürich";  // any = Definition, die "Es kann alles sein" bedeutet
let myBoolean: boolean = false;

let result: number = myNumber * parseInt(myString); //Die parseInt() Methode liest ein String-Argument ein und gibt eine ganze Zahl im angegebenen Zahlensystem zurück
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bankkonto = /** @class */ (function () {
    function Bankkonto() {
        this.saldo = 0; // Default status = public , d.h man kann auch extern darauf zugreifen
        this.inhaber = "";
        this.iban = ""; // default leer, gibt uns undefined
    }
    Bankkonto.prototype.geldEinzahlen = function (geldbetrag) {
        if (geldbetrag >= 0) {
            this.saldo += geldbetrag;
        }
    };
    Bankkonto.prototype.geldAbheben = function (geldbetrag) {
        if (this.saldo >= geldbetrag) {
            this.saldo -= geldbetrag;
            return geldbetrag;
        }
        else {
            alert("Saldo zu tief!");
            // Info per SMS...
            return -1;
        }
    };
    Bankkonto.prototype.getSaldo = function () {
        return this.saldo;
    };
    return Bankkonto;
}());
// Mittels "extends" vererben wir die Eigenschaften. Wir erhalten die Grundklasse Bankkonto, aber können diese erweitern
var Privatkonto = /** @class */ (function (_super) {
    __extends(Privatkonto, _super);
    function Privatkonto() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.zins = 0.01;
        return _this;
    }
    Privatkonto.prototype.rabattErhalten = function () {
        console.log("Rabatt gewährt!");
    };
    return Privatkonto;
}(Bankkonto));
var Sparkonto = /** @class */ (function (_super) {
    __extends(Sparkonto, _super);
    function Sparkonto() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.zins = 0.1;
        return _this;
    }
    return Sparkonto;
}(Bankkonto));
var kontoPersonA = new Privatkonto(); // new() = neue Instanz
var kontoPersonB = new Sparkonto();
kontoPersonA.geldEinzahlen(200);
kontoPersonB.geldEinzahlen(300);
kontoPersonA.geldAbheben(400);
console.log(kontoPersonA.getSaldo());
console.log(kontoPersonB.getSaldo());
//# sourceMappingURL=intro.js.map