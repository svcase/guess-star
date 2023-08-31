const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
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
    res.render('index.ejs');
  } catch(e) {
    res.status(404).send("initial load error.")
  }
  });

  app.get("/home", catchAsync(async (req, res) => {

      guess.song = '';
      guess.count = '';
      guess.second = '';
      guess.millisecond = '';

      const spotifyResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          queryString.stringify({
            grant_type: "client_credentials",             
            client_id: process.env.CLIENT_ID,                         
            client_secret: process.env.CLIENT_SECRET,              
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
      
      let numTest = numChange(correct.song.replace(/’/g, "'"));

      res.render('home.ejs', { correct, guess, numTest, playerLink, guest: process.env.GUEST });
  }));

  app.post('/home', catchAsync(async (req, res) => {
    guess.song = req.body.song;
    guess.count = req.body.guesses;
    guess.second = req.body.second;
    guess.millisecond = req.body.milSecond; 

    if (guess.song.toLowerCase().replace(/’/g, "'").trim() === correct.song.toLowerCase().replace(/’/g, "'")) {
      res.render('result.ejs', { correct, guess });;
    } else if (guess.count === "4") {
      res.render('wrong.ejs', { correct, guess });
    } else {
      return false;
    }
}));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Oops Something went wrong.'} = err;
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Example app is listening on port ${port}.`)
);