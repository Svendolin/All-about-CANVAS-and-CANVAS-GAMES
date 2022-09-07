
// mp3 dem Soundobjekt hinzuführen:
var sound = new Howl ({
  src: ['core/media/audio/Wildlife_1.mp3'],
  preload: true,
  volume: 0.3,
  autoplay: false,
  onplay: function() {  // Ganz viele Funktionen in der DOCS von Howler.js
    console.log('Play');
  }
});

sound.on('load',function() {
  var startButton = document.getElementById('start');
  startButton.addEventListener('click', e => {
    // this.classList.toggle('aktiv');
  
    if(sound.playing()) {
      sound.pause();
    } else {
      sound.play();
      // sound.fade(0,0.5,4500);
    }
  });
});

