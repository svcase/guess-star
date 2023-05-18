const audio = document.getElementById('player');
const playPause = document.getElementById('togglePlay');

let second = 00;
let count = 00;

playPause.addEventListener('click', function() {
  if (audio.paused == true) {
    audio.play();
    playPause.innerHTML = '&#10074; &#10074';
    timer = true;
    stopWatch();
  } else {
    audio.pause();
    playPause.innerHTML = '&#9658';
    timer = false;
    stopWatch();
  }
});

function stopWatch() {
  if (timer) {
      count++;

      if (count == 100) {
          second++;
          count = 0;
      }

      if (second == 20) {
          timer = false;
          playPause.disabled = true;
      }

      let secString = second;
      let countString = count;

      if (second < 10) {
          secString = "0" + secString;
      }

      if (count < 10) {
          countString = "0" + countString;
      }

      document.getElementById('sec').innerHTML = secString;
      document.getElementById('count').innerHTML = countString;
      setTimeout(stopWatch, 10);
  }
};