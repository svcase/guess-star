const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const queryString = require("node:querystring");
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

let playerLink = process.env.PLAYER_LINK;

let correct = {
  artist: '',
  song: '',
  albumImgSrc: '',
  year: '',
  listen: ''
}
let guess = {
  artist: '',
  song: '',
  count: '',
  second: '',
  millisecond: ''
}   

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

app.get("/", (req, res) => {
  try {
    res.render('index.ejs', { clientId: process.env.CLIENT_ID, redirect: process.env.REDIRECT_URI });
  } catch(e) {
    res.status(404).send("Sorry, technical difficulties. Try again later.")
  }
  });

  app.get("/home", async (req, res) => {
    try {
    const spotifyResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: process.env.REDIRECT_DECODE,       //change once hosted
        }),
        {
          headers: {
            Authorization: "Basic " + process.env.BASE64,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

    const answer = await axios.get(`https://api.spotify.com/v1/tracks/${process.env.TRACK}`, { 
      headers: 
    { Authorization: `Bearer ${spotifyResponse.data.access_token}` }
    });
    correct.artist = answer.data.artists[0].name;
    correct.song = answer.data.name;
    correct.albumImgSrc = answer.data.album.images[1].url;
    correct.releaseYear = answer.data.album.release_date;
    correct.listen = answer.data.external_urls.spotify;
    
    let numTest = numChange(correct.song);

    res.render('home.ejs', { correct, guess, numTest, playerLink });
  } catch(e) {
    res.status(404).send("Sorry, technical difficulties. Try again later.")
  }
  });


  app.post('/home', async (req, res) => {
    guess.song = req.body.song;
    guess.count = req.body.guesses;
    guess.second = req.body.second;
    guess.millisecond = req.body.milSecond;                    

    if (guess.song.toLowerCase() === correct.song.toLowerCase()) {
      res.render('result.ejs', { correct, guess });
    } else if (guess.count === "4") {
      res.render('wrong.ejs', { correct, guess });
    } else {
      return false;
    }
});

app.listen(3000, () => {
    console.log('listening on 3000');
  });