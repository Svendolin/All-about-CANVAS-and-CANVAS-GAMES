/* Hier wird geschrieben - SHIFT + CTRL + B drücken, mit "watch" starten und los gehts! :D
 BITTE VOR JEDER BEARBEITUNG DURCHFÜHREN!
 Im Terminal wird nun watch angezeigt */


/// --- Class mit XY Wert der Schlange --- ///
class XY {
  x: number;
  y: number;

  constructor(pX: number = 0, pY: number = 0) {  // Beide Numberwerte übergeben, deshalb Wert definieren (0)
    this.x = pX;
    this.y = pY;


  }
}


/// --- SNAKE ENGINE (Elemente Initianisieren) --- ///
class SnakeEngine {           // Datei, die alles am Laufen hält
  private snake: Array<XY>;   // Private Attriibute. Name: Funktion < Typ, um XY Elemente abspeichern>
  private snakeDirection: XY; // Schlangenkopf und Körper
  private food: XY;           // Nahrungswürfel
  private gameGrid: XY;       // Gridfeld (Spielbrett)

  // 3 Referenzen //
  private refCanvas: HTMLCanvasElement; //Kann effentiv auf diese Funktion prüfen. Statt any (irgendetwas) können wir schon die Art und weise definieren
  private ctx: CanvasRenderingContext2D;
  private refST: number;                // refST = setTimeout (Siehe W3C)

  public constructor(pCanvasId: string) {                                   // Public = default. Wäre nicht nötig zu schreiben / CanvasId auch okay, p einfach für Parameter
    this.refCanvas = <HTMLCanvasElement>document.getElementById(pCanvasId); // <In dieses Canvas Element umwandeln> Ansonsten wird das als HTML Element gesehen = Fehler
    this.ctx = this.refCanvas.getContext("2d", {alpha: true});              // Canvas soll transparenter Hintergrund haben
    this.resizeCanvas();
    this.initEventListeners();
    this.restartGame();
  }                



  // Methoden (funktionalitäten) zu den obigen Objekten aufrufen //
  /* z.B initEventListeners() = Für die Schlangensteuerung / restartGame() = Button für Restart /
        moveSnake() = Schlangenfortbewegung / collisionDetection() / render() = Für die optische Darstellung (Farbe, Game Over)
        generateFood() = Essen random generieren / resizeCanvas() = dynamisches Canvas */

  resizeCanvas(): void {    // Void = Kein Rückgabewert
    this.refCanvas.width = this.refCanvas.clientWidth;
    this.refCanvas.height = this.refCanvas.clientHeight;
  }

  initEventListeners(): void {  
    // -- ResizeListener -- //
    window.addEventListener("resize", event => {
      this.resizeCanvas();
    });
    
    // -- KeydownListener -- //
    window.addEventListener("keydown", event => {
      console.log("User Key: " + event.key);
        switch(event.key) {  // So können wir mit Pfeilen und Tasten uns in die jeweilige Richtung begwegen
          case "w":
          case "ArrowUp":
            this.snakeDirection.x = 0;
            this.snakeDirection.y = -1;
          break;

          case "a":
          case "ArrowLeft":
            this.snakeDirection.x = -1;
            this.snakeDirection.y = 0;
          break;

          case "d":
          case "ArrowRight":
            this.snakeDirection.x = 1;
            this.snakeDirection.y = 0;
          break;
          
          case "s":
          case "ArrowDown":
            this.snakeDirection.x = 0;
            this.snakeDirection.y = 1;
          break;
        }
    });
  }

  restartGame(): void {
    clearTimeout(this.refST)  // Damit wird verhindert, dass bei jedem Restart das setTimeout dafür sorgt, um eine Sekunde schneller zu sein = Bleibt nun immer gleichschnell
    this.snake = [new XY(4,2), new XY(3,2), new XY(2,2), new XY(2,3)];  //Defaultwert der Schlange, wie die Schlange aussehen soll XY(4,2) Startwert vom Kopf, dann die beiden Köprerelemente
    this.snakeDirection = new XY(1,0); // Bewegungsweg in X-Richtung somit alle 1 sek um 1 pixel in x
    this.gameGrid = new XY(20,10);
    this.generateFood();
    this.moveSnake();
  }

  /// --- Grünes Foodelement initialieren (property ist oben: food XY - Zufälliges Feld auf der Karte)
  generateFood() { // Ist eine Methode() btw
    do {
      this.food = new XY(
        Math.floor(Math.random() * this.gameGrid.x), // math.random = Pseudozufallszahl (Später im PHP wichtig)
        Math.floor(Math.random() * this.gameGrid.y)
    );
  } while(this.checkIsPointOnSnake(this.food, true)); // Check, ob dieser Foodwert nicht auf der Schlange selber ist.
}


  moveSnake(): void {  // Methode soll keinen Rückgabewert haben.

    // Letztes Körperelement beim erfolgreichen Mampf
    let lastSnakeElement = new XY(
      this.snake[this.snake.length-1].x,
      this.snake[this.snake.length-1].y
      );
    // Körperelemente dynamisch mitbewegen
     for (let s = this.snake.length -1; s > 0; s--) {
        this.snake[s].x = this.snake[s-1].x;
        this.snake[s].y = this.snake[s-1].y;

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
      alert("GAME OVER!")
    }
    else {
      this.render();
      this.refST = setTimeout(this.moveSnake.bind(this), 2500 / Math.pow(1.5, this.snake.length)); // Bewegungsfaktor jede Sekunde. Hinterer Teil: Bei jedem Mampf soll die Schlange etwas schnller gehen
    }                                                                   // 1.5 zeigt die Potenz. 1.2 = Etwas langsamer
    
  }

  // passiert eine Kollision? Dann muss TRUE zurückgegeben werden:
  collisionDetection(): boolean  {
    let result: boolean = false;

    if(this.snake[0].x < 0 || 
      this.snake[0].y < 0  ||
      this.snake[0].x >= this.gameGrid.x ||
      this.snake[0].y >= this.gameGrid.y ||
      this.checkIsPointOnSnake(this.snake[0], false)) {
      result = true;
    }
    return result; // Somit sollte bei allen 4 Seiten in die Wand crashen, einen Alert anzeigen
      // Dadurch kommt der Wert des Boolean immer zurück, sehr wichtig, ansonsten Error
  }

  /// --- Durch die ganze Schlange durchgehen, prüfen, ob sich die Schlange selber trifft --- ///
  checkIsPointOnSnake(pPoint: XY , pCheckHeadElement: boolean = false): boolean {  //Mit dieser Methode wird geprüft, ob der Kopf auf der Schlange liegt
    let result: boolean = false;
    let i = (pCheckHeadElement) ? 0:1;   // ? ist es true, wenn 0 der wahre Wert ist: 1 der falsche Wert

    for (; i < this.snake.length; i++) {
      if (pPoint.x === this.snake[i].x && 
        pPoint.y === this.snake[i].y) {
          result = true;
          break;
        }
      }

    return result;
  }

  render() {
    this.ctx.clearRect(0,0, this.refCanvas.width, this.refCanvas.height);
     console.log("PAINT") // Testen, ob es funktioniert (In der Konsole etwas angezeigt wird)
    let gridElementWH = this.refCanvas.width / this.gameGrid.x;
    for (let i = 0; i < this.snake.length; i++) {
      if (i === 0) {
        this.ctx.fillStyle = "#ff0000";  // Erstes Schlangenstück rot, der rest schwarz
      }
      else {
        this.ctx.fillStyle = "#aaaaaa";
      }
      this.ctx.fillRect(this.snake[i].x * gridElementWH, // *gridElementWH = Definiert wie viele px ein grid Element wert ist
                        this.snake[i].y * gridElementWH,
                        gridElementWH,
                        gridElementWH); 
    }
    // Hier rendern wir das Random food:
    this.ctx.fillStyle = "#0000ff";
    this.ctx.fillRect(this.food.x * gridElementWH, // *gridElementWH = Definiert wie viele px ein grid Element wert ist
      this.food.y * gridElementWH,
      gridElementWH,
      gridElementWH); 

  }


}

