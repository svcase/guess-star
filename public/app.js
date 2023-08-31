const audio = document.getElementById('player');
const playPause = document.getElementById('togglePlay');

let guessNum = 1;

audio.addEventListener('timeupdate',function(){
  let timer = audio.currentTime * 1000;
  let secs = "";         
  let mills = "";    
  if (timer < 1000) {
    secs = "00";
  } else if (timer < 10000) {
    secs = ("0" + timer).substring(0,2);
  } else { 
    secs = timer.toString().substring(0,2);
  }

  if (timer < 1000) {
    mills = ("00" + timer).substring(2,4);
  } else if (timer < 10000) {
    mills = ("0" + timer).substring(2,4);
} else {
  mills = timer.toString().substring(2,4);
}

document.getElementById('count').innerHTML = mills;
document.getElementById('sec').innerHTML = secs;

if (secs == "25") {
    audio.pause();
    document.getElementById('count').innerHTML = "00";
    playPause.disabled = true;
}

},false);


playPause.addEventListener('click', function() {
  if (audio.paused == true) {
    audio.play();
    playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
    playPause.style.backgroundColor = '#FFE400';
  } else {
    audio.pause();
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    playPause.style.backgroundColor = '#32cd32';
  }
});

function wrongGuess() {
  document.getElementById('songSearch').style.backgroundColor = '#ff652f';
  document.getElementById('thisGuess').style.color = '#ff652f';
  setTimeout(() => { 
    document.getElementById('songSearch').style.backgroundColor = 'white';
    document.getElementById('thisGuess').style.color = 'white';
   }, 400);
};


function numChange(str) {
  let orig = str.toLowerCase();
  let result = '';
  if (orig) {
      for (let i=0; i<orig.length; i++) {
          result += orig.charCodeAt(i);
      }
      return result;
  }
};

function checkClick(e) {
  const guess = numChange(document.getElementById('songSearch').value.replace(/’/g, "'").trim());
  let currentSec = document.getElementById('sec').innerHTML;
  let currentMilSec = document.getElementById('count').innerHTML;
  guessNum += 1;
  document.getElementById('guessCount').value = guessNum.toString();
  document.getElementById('seconds').value = currentSec;
  document.getElementById('milliseconds').value = currentMilSec;
  if (guessNum < "4") {
  document.getElementById('thisGuess').innerHTML = guessNum;
  } else document.getElementById('thisGuess').innerHTML = "3";


  if (guess !== actual && guessNum < "4") {
      e.preventDefault();
      wrongGuess();
      document.getElementById('songSearch').value = '';
      return false;
   } else {
      guessNum = "1";
      return true;
   }
};