// Typescript empfohlen, um einzelne Dateien auszulagern. Übersicht ist alles, auch für den Server braucht es Harmonie



function GameEngine(canvasId) {
  //methods
  this.initGameEngine = function(canvasId) {
    this.refCanvas = document.getElementById(canvasId);
    if (this.refCanvas.getContext) {
      this.ctx = this.refCanvas.getContext('2d', {alpha: true});
      this.resizeCanvas();
      this.initListeners();

      // Münzbild initialisieren 
      this.imgMoney = new Image();
      this.imgMoney.src = "media/spritesheet_money.png";
      this.imgMoney.onload = function() {
        this.restartGame();
      }.bind(this); // So bezieht sich this auf die Function (Auf die nächst vorherige function), statt dem Bild imgMoney

      this.soundSuccess = new Howl({src: ["media/5_Wickets.mp3"]});
      this.soundGameover = new Howl({src: ["media/Health_Alert_3.mp3"]});
      
    }
    else {
      alert("Your browser doesn't support the canvas-tag.");
    }
  };
  
  this.resizeCanvas = function() { //.this spricht auf die GameEngine an
    this.refCanvas.width = this.refCanvas.clientWidth;
    this.refCanvas.height = this.refCanvas.clientHeight;
  };
  

  /// --- Canvas dynamisch gestalten (Breiten neu berechnen, damit das Spiel nicht verzerrt wird) --- ///
  this.initListeners = function() {
    window.addEventListener("resize", () => { //NICHT "this.window", da wir einen globalen Wert haben wollen, welcher auf den Canvas zurückgreift
      //Arrow function => statt: function (), so beszieht sich .this hier und wir müssen nicht wie im unteren Beispiel bind() benutzen
      this.resizeCanvas();
    });

    $("#" + canvasId).on("mousedown", function (evt) {
      let cPos = getPositionFromEvent(evt, this.refCanvas);
      console.log("x:" + cPos.x + ", y:" + cPos.y); // Zeigt Klick-Position X: und Y: in der Console an
      //call checkPlayerClickPosition
      this.checkPlayerClickPosition(cPos);
    }.bind(this)); // Man gibt this an einer Funktion weiter mittels .bind()

    

  };


  
  ///// ------------------------------- Drei Funktionen ------------------------------ /////


  /// --- checkGameStart-Prozess durchführen --- ///
  this.checkGameStart = function() {
      
  };
  
  /// --- restartGame-Prozess ankurbeln, falls er nicht schon bereits läuft (geloopt wird) --- ///
  this.restartGame = function() {
    if (this.renderRef !== null) { // Loop unterbrechen
      window.cancelAnimationFrame(this.renderRef);
    }
    this.gameObjects = [];  // Leeres Array wird instanziert. pop() unshift() Splice() löscht ja nur etwas. Da wir ne leere Array hier einsetzen, wir beim Restart Knopf nun alles gelöscht
    this.lives = 1;
    this.noSuccessObj = 0; //So starten wir mit 1 Leben und noch keinen erfolgreich geklickten Objekten
    this.tsGameStart = this.tsLastObj = this.tsLastRender = Date.now(); // Ergibt den aktuellen Zeitwert
    this.render(); // Funktion durch die render() Methode aufrufen

    
    // Der gerenderete Wert ist immer Ecke oben links
  };
  

  
  /// --- checkPlayerClickPosition-Prozess (Prozess wird 2D Collision Detection genannt) --- ///
  this.checkPlayerClickPosition = function(cPos) {
    for (let i = 0; i < this.gameObjects.length; i++) {
      let tempMO = this.gameObjects[i]; // Berührungsflächen nach und nach aussschliessen! Wir starten mit der X-Achse...
        if(cPos.x >= tempMO.x && cPos.x <= tempMO.x + tempMO.width && //Obejkt fällt herunter, links und rechts vom Objekt ist keine getroffene Fläche und das wird geprüft. Klickt man aufs Objekt selber, so erscheint das IF statement
           cPos.y >= tempMO.y && cPos.y <= tempMO.y + tempMO.height) { // Selbiges hier auf der Y-Achse.Somit sind alle Flächen gedeckt, die eine nicht getroffene Fläche zeigen
            console.log("Objekt Getroffen");
            this.soundSuccess.play(); // Sound mit der gleichen Variable angeben und wie in Howler.js beschrieben mit .play() starten
            this.noSuccessObj++;          // Für Zählerei notwendig. Anhängig davon sollten mehr und mehr coins generiert werden
            this.lives++; // Für jedes geklickte Element GEWINNEN wir ein Leben
            this.gameObjects.splice(i,1); // Bei einem getroffenen Klick soll das Element verschwinden (Wie unten schon mal sorgt splice dafür, dass das Array gelöscht wird)
            i--;
            

        } else {
          console.log("Objekt verfehlt");
     }
      
    }
    
  };
  
  /// --- Rendermethode, wo alles gerendert wird --- ///
  this.render = () => { // Arrow function () => statt function() um einen funktionierenden render()Loop zu generieren, den wir in der Console anschauen können
    if (this.lives > 0) {  // Leben testen (Anzahl Leben, nicht Punkte)
    this.renderRef = window.requestAnimationFrame(this.render); 
    let actTime = Date.now(); // Gibt die Anzahl der Millisekunden, die seit dem 01.01.1970 00:00:00 UTC vergangen sind zurück.
    let delta = actTime - this.tsLastRender;
    this.tsLastRender = actTime;
    console.log(delta); // Um den Zeitabstand zu sehen: Wert Milisekunden seit dem letzten Renderprozess, 17 Milisekunden z.B. 0 Deltawert

    //check endgame
    
    
    /// --- clear canvas = Objekt soll sich als Würfel bewegen, nicht als Linie --- ///
    this.ctx.clearRect(0,0,this.refCanvas.width, this.refCanvas.height);
   
   
    // --- Alle x-Sekunden wird automatisch ein neues Element erstellt --- //
    let tsWaitUntilNewObj = 150;
    if (this.noSuccessObj < 50) {   // Wenn die Werte grösser als 20 geklickte Stück sind, so wird die Anzahl weiter erhöht
      tsWaitUntilNewObj = 650 - (this.noSuccessObj * 10);

    } 
     /* else if (this.noSuccessObj < 40) { // Wenn die Werte grösser als 40 geklickte Stück sind, so wird die Anzahl weiter erhöht
       tsWaitUntilNewObj = 600 - (this.noSuccessObj * 10);
     }

 */
    if (this.tsLastObj + tsWaitUntilNewObj < actTime) {
      // --- Münzobjekt, das von Oben nach Unten fallen soll --- //
        this.gameObjects.push(new MoneyObject (Math.random() * (this.refCanvas.width-64),-64,64,64));  //Random * Anfangspunkt Breite, Anfangspunkt Höhe, Distanz X Breite, Distanz Y Höhe
        this.tsLastObj = actTime;
      }
    
    
    // --- move() und render() alle MoneyObjects mit einem for-loop -- //
    // --- Hier sorgen wir dafürm, dass das Objekt gelöscht wird, wenn es runterfällt unf nicht geklickt wird --- //
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].move(delta); // Wie lange die Zeitdauer ist, seit die Bewegung stattfindet (Deltawert)
      if(this.gameObjects[i].y <= this.refCanvas.height) { // Wenn coin =  kleiner oder gleich Höhe Canvas, dann rendern. Ansonsten sollte es gelöscht werden (in den Splice fallen)
        this.gameObjects[i].render(this.refCanvas, this.ctx, this.imgMoney, delta); // Zugriff auf Canvas wäre toll. (Variable, Context, Renderbild, Münzdrehung = 4 Parameter)
      }
      else {
        this.gameObjects.splice(i,1); // Wie pop() oder shift(), aber splice nimmt ein bestimmtes Element aus der Array. (i = aus dem Index, 1 = Anzahl)
        i--; // i Wert eines zurücksetzen, weil der Index durch ++ immer eine Nummer "nachschiebt". BEI INDEXDINGEN ETWAS LÖSCHEN ALS FOR-LOOP BRINGT IMMER PROBLEME MIT SICH
        this.lives--; // Bei jedem nicht geklickten Objekt VERLIEREN wir ein Leben 
      }
    
    }
    
    
    /// -- Den SCORE (noSuccessObj), LEBEN und SPIELZEIT rendern, wenn wir nicht im GAME OVER Bereich sind -- /// 

    let gametime = ((actTime - this.tsGameStart)/1000).toFixed(1);  // Durch /1000 zeigt dann 1.000 an statt 1000 und .toFixed(2) zeigt 2 Nachstellen nach Komma 1.00 amzeigen lassen
    let playerInfo = "Coins: " + this.noSuccessObj + ", Lives: " + this.lives + ", Time: " + gametime;
    this.ctx.fillStyle = "#000000";
    this.ctx.font= "bold 18px Arial";
    this.ctx.textAlign = "end";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(playerInfo, this.refCanvas.width -40, 40);

      
    }
    else {
      /// --- GAME OVER STYLE --- ///
      this.ctx.strokeStyle = "#FBAE3F";
      this.ctx.fillStyle = "#000000";
      this.ctx.font="bold 50px Arial";
      this.ctx.textAlign="center";
      this.ctx.textBaseline="middle";
      this.ctx.fillText("GAME OVER!", this.refCanvas.width/2, this.refCanvas.height/2);
      this.ctx.strokeText("GAME OVER!", this.refCanvas.width/2, this.refCanvas.height/2);
      this.renderRef = null;
      this.soundGameover.play();
    
    } 
  };
  
  /// --- Variablen fürs Rendering --- ///
  this.refCanvas = null;
  this.ctx = null;
  this.renderRef = null;

  /// --- Variablen für Objekte --- ///
  this.gameObjects = [];
  this.noSuccessObj = 0; // Numbers of successful Objects quasi

  /// --- Variablen für Game --- ///
  this.tsGameStart = 0; // ts = TimeStamp letzter Start des Games
  this.tsLastObj = 0; // Time Stamp Letzte Objekterzeugung
  this.tsLastRender = 0; // Time Stamp letzter Render

  /// --- Lebensleiste --- ///
  this.lives = 1; 

  /// --- Spridebild (Drehende Münzen) Propery --- ///
  this.pImgMoney = null; // Auf diesen Wert hin prüfen
  

  /// --- Soundvariablen --- ///
  this.soundSuccess = null;
  this.soundGameover = null;
  
  /// --- Initialisierung der GameEngine --- ///
  this.initGameEngine(canvasId);

  
}

/// --- BAUPLAN MONEYOBJECT (Startwerte) - Kopiert aus dem HTML File excercise-008.html --- ///
 function MoneyObject(paramX = 0, paramY = 0, paramH = 0, paramW = 0) {  // Leeres Objekt, die übergeordnete Umgebung. Wir geben 2 Parameter mit
  this.x = paramX; // this ist immer die Referenz (Property des Objekts), um auf alle Elternproperties und Methoden zugreifen
  this.y = paramY; // Lokale Properties. Denen geben wir einen Wert mit... X und Y
  this.width = paramW;
  this.height = paramH;
  this.speed = 1; // Jeder Variable können wir eine Methode() zuweisen
  this.spriteIndex = 0; // Pro einzelnes Moneyobject wird das abgespeichert. (Die Münze soll sich ja drehen)
  this.spriteDelta = 0; //
  this.move = function(delta) { // Jedes mal wenn ich move aufrufe, soll die Y Variable um den Speed dazuaddiert werden. Jedes Moneyobject weiss somit selber, wie schnell es ist...
    this.y += (delta/8) * this.speed; //...Sonst wäre alles viel zu komplex (X-Fach den Münzen Bewegung zuschreiben)
  };    // Deltawert ist der Grundwert des Tempos /8 = langsam - /4 = schnell. So kann der Speedwert angepasst werden.



  /// --- MoneyObject wollen wir abbilden (Münzen sollen wie Münzen aussehen) --- ///
  this.render = function(pRefCanvas, pCtx, pImgMoney, delta) { // Parameter, die übergeben werden = p davor für Parameter
    // console.log("render MoneyObject");
   /* pCtx.fillStyle = "#ff0000"; 
    pCtx.fillRect(this.x,this.y,this.width,this.height); */
    pCtx.drawImage(pImgMoney, (this.spriteIndex * 64),0,64,64, this.x, this.y, this.width, this.height); // (this.spriteImage*64) = So gehen wir in 64er Rahmen durch alle 10 Münzbilder von Links nach rechts.
    
        this.spriteDelta += delta; //Spirtedelta Wert mit dem Richtwert der Drehung der Münze gleichsetzen
        if (this.spriteDelta >= 30) {  // Für jedes einzelne Bild soll mindestens 40ms dargestellt werden (Alle 40ms ein neues Bild in der Drehung)
          this.spriteIndex += Math.floor(this.spriteDelta/30); // Framerate kann ja tief sein, darum passen wir das an. Math.floor sorgt dafür, dass er Wert ab- oder aufgerundet wird. 39.9 zu 40 z.B
          this.spriteDelta %= 30; // %= Rechnet der Restwert aus. Somit Restwert aus 40. = Egal welche Framerate, er sollte gleichschnell drehen
        
        // this.spriteIndex++; //Jedes Mal um 1 erhöhen (Bild zu Bild zu Bild, 10 Money-Bilder Total) = OBSOLET, da wir die Framerate anpassen 
        if (this.spriteIndex >= 10) { // Max 10 Bilder
          this.spriteIndex = 0; // Starten beim Anfang
        }

    }
    

  };

} 
