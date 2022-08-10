/* Hier wird geschrieben - SHIFT + CTRL + B drücken, mit "watch" starten und los gehts! :D
 BITTE VOR JEDER BEARBEITUNG DURCHFÜHREN!
 Im Terminal wird nun watch angezeigt */
/// --- Class mit XY Wert der Schlange --- ///
var XY = /** @class */ (function () {
    function XY(pX, pY) {
        if (pX === void 0) { pX = 0; }
        if (pY === void 0) { pY = 0; }
        this.x = pX;
        this.y = pY;
    }
    return XY;
}());
/// --- SNAKE ENGINE (Elemente Initianisieren) --- ///
var SnakeEngine = /** @class */ (function () {
    function SnakeEngine(pCanvasId) {
        this.refCanvas = document.getElementById(pCanvasId); // <In dieses Canvas Element umwandeln> Ansonsten wird das als HTML Element gesehen = Fehler
        this.ctx = this.refCanvas.getContext("2d", { alpha: true }); // Canvas soll transparenter Hintergrund haben
        this.resizeCanvas();
        this.initEventListeners();
        this.restartGame();
    }
    // Methoden (funktionalitäten) zu den obigen Objekten aufrufen //
    /* z.B initEventListeners() = Für die Schlangensteuerung / restartGame() = Button für Restart /
          moveSnake() = Schlangenfortbewegung / collisionDetection() / render() = Für die optische Darstellung (Farbe, Game Over)
          generateFood() = Essen random generieren / resizeCanvas() = dynamisches Canvas */
    SnakeEngine.prototype.resizeCanvas = function () {
        this.refCanvas.width = this.refCanvas.clientWidth;
        this.refCanvas.height = this.refCanvas.clientHeight;
    };
    SnakeEngine.prototype.initEventListeners = function () {
        var _this = this;
        // -- ResizeListener -- //
        window.addEventListener("resize", function (event) {
            _this.resizeCanvas();
        });
        // -- KeydownListener -- //
        window.addEventListener("keydown", function (event) {
            console.log("User Key: " + event.key);
            switch (event.key) { // So können wir mit Pfeilen und Tasten uns in die jeweilige Richtung begwegen
                case "w":
                case "ArrowUp":
                    _this.snakeDirection.x = 0;
                    _this.snakeDirection.y = -1;
                    break;
                case "a":
                case "ArrowLeft":
                    _this.snakeDirection.x = -1;
                    _this.snakeDirection.y = 0;
                    break;
                case "d":
                case "ArrowRight":
                    _this.snakeDirection.x = 1;
                    _this.snakeDirection.y = 0;
                    break;
                case "s":
                case "ArrowDown":
                    _this.snakeDirection.x = 0;
                    _this.snakeDirection.y = 1;
                    break;
            }
        });
    };
    SnakeEngine.prototype.restartGame = function () {
        clearTimeout(this.refST); // Damit wird verhindert, dass bei jedem Restart das setTimeout dafür sorgt, um eine Sekunde schneller zu sein = Bleibt nun immer gleichschnell
        this.snake = [new XY(4, 2), new XY(3, 2), new XY(2, 2), new XY(2, 3)]; //Defaultwert der Schlange, wie die Schlange aussehen soll XY(4,2) Startwert vom Kopf, dann die beiden Köprerelemente
        this.snakeDirection = new XY(1, 0); // Bewegungsweg in X-Richtung somit alle 1 sek um 1 pixel in x
        this.gameGrid = new XY(20, 10);
        this.generateFood();
        this.moveSnake();
    };
    /// --- Grünes Foodelement initialieren (property ist oben: food XY - Zufälliges Feld auf der Karte)
    SnakeEngine.prototype.generateFood = function () {
        do {
            this.food = new XY(Math.floor(Math.random() * this.gameGrid.x), // math.random = Pseudozufallszahl (Später im PHP wichtig)
            Math.floor(Math.random() * this.gameGrid.y));
        } while (this.checkIsPointOnSnake(this.food, true)); // Check, ob dieser Foodwert nicht auf der Schlange selber ist.
    };
    SnakeEngine.prototype.moveSnake = function () {
        // Letztes Körperelement beim erfolgreichen Mampf
        var lastSnakeElement = new XY(this.snake[this.snake.length - 1].x, this.snake[this.snake.length - 1].y);
        // Körperelemente dynamisch mitbewegen
        for (var s = this.snake.length - 1; s > 0; s--) {
            this.snake[s].x = this.snake[s - 1].x;
            this.snake[s].y = this.snake[s - 1].y;
        }
        // Kopfelement der Schlange 
        this.snake[0].x += this.snakeDirection.x;
        this.snake[0].y += this.snakeDirection.y;
        // Kollision Kopfelement mit Foodelement
        if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
            this.snake.push(lastSnakeElement);
            this.generateFood();
        }
        // True-Fall bei Kollision
        if (this.collisionDetection()) {
            // If TRUE, = gameover!
            alert("GAME OVER!");
        }
        else {
            this.render();
            this.refST = setTimeout(this.moveSnake.bind(this), 2500 / Math.pow(1.5, this.snake.length)); // Bewegungsfaktor jede Sekunde. Hinterer Teil: Bei jedem Mampf soll die Schlange etwas schnller gehen
        } // 1.5 zeigt die Potenz. 1.2 = Etwas langsamer
    };
    // passiert eine Kollision? Dann muss TRUE zurückgegeben werden:
    SnakeEngine.prototype.collisionDetection = function () {
        var result = false;
        if (this.snake[0].x < 0 ||
            this.snake[0].y < 0 ||
            this.snake[0].x >= this.gameGrid.x ||
            this.snake[0].y >= this.gameGrid.y ||
            this.checkIsPointOnSnake(this.snake[0], false)) {
            result = true;
        }
        return result; // Somit sollte bei allen 4 Seiten in die Wand crashen, einen Alert anzeigen
        // Dadurch kommt der Wert des Boolean immer zurück, sehr wichtig, ansonsten Error
    };
    /// --- Durch die ganze Schlange durchgehen, prüfen, ob sich die Schlange selber trifft --- ///
    SnakeEngine.prototype.checkIsPointOnSnake = function (pPoint, pCheckHeadElement) {
        if (pCheckHeadElement === void 0) { pCheckHeadElement = false; }
        var result = false;
        var i = (pCheckHeadElement) ? 0 : 1; // ? ist es true, wenn 0 der wahre Wert ist: 1 der falsche Wert
        for (; i < this.snake.length; i++) {
            if (pPoint.x === this.snake[i].x &&
                pPoint.y === this.snake[i].y) {
                result = true;
                break;
            }
        }
        return result;
    };
    SnakeEngine.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.refCanvas.width, this.refCanvas.height);
        console.log("PAINT"); // Testen, ob es funktioniert (In der Konsole etwas angezeigt wird)
        var gridElementWH = this.refCanvas.width / this.gameGrid.x;
        for (var i = 0; i < this.snake.length; i++) {
            if (i === 0) {
                this.ctx.fillStyle = "#ff0000"; // Erstes Schlangenstück rot, der rest schwarz
            }
            else {
                this.ctx.fillStyle = "#aaaaaa";
            }
            this.ctx.fillRect(this.snake[i].x * gridElementWH, // *gridElementWH = Definiert wie viele px ein grid Element wert ist
            this.snake[i].y * gridElementWH, gridElementWH, gridElementWH);
        }
        // Hier rendern wir das Random food:
        this.ctx.fillStyle = "#0000ff";
        this.ctx.fillRect(this.food.x * gridElementWH, // *gridElementWH = Definiert wie viele px ein grid Element wert ist
        this.food.y * gridElementWH, gridElementWH, gridElementWH);
    };
    return SnakeEngine;
}());
//# sourceMappingURL=snakeEngine.js.map