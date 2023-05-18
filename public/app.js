const audio = document.getElementById('player');
const playPause = document.getElementById('togglePlay');

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

if (timer < 10000) {
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
    playPause.innerHTML = '&#10074; &#10074';
  } else {
    audio.pause();
    playPause.innerHTML = '&#9658';
  }
});

function wrongGuess() {
  document.getElementById('songSearch').style.backgroundColor = '#f6a0a0';
  document.getElementById('thisGuess').style.color = '#f6a0a0';
  setTimeout(() => { 
    document.getElementById('songSearch').style.backgroundColor = 'white';
    document.getElementById('thisGuess').style.color = 'white';
   }, 250);
};