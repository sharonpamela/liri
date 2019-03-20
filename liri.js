

require('dotenv').config();

let moment = require('moment');

let keys = require('./keys.js');

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

let inquirer = require("inquirer");

// Listen for user input
// let whatToDo = process.argv[2];
// let thingToDo = process.argv.slice(3).join('+');

actionPrompt();

// ask user what they want to do
function actionPrompt() {
  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        choices: ["Search for a Band", "Search for a Song", "Search for a movie", "Do something random", "Nothing\n"],
        name: "action"
      },
      {
        message: "What would you like to searh for?",
        type: "input",
        name: "searchKey"
      }
    ])
    .then(function (inquirerResponse) {
      let action = inquirerResponse.action;
      let searchKey = inquirerResponse.searchKey.replace(' ', '+');

      // make a case so that liri listens to any of the 4 specific commands available
      switch (action) {
        case "Search for a Band":
          getBandInfo(searchKey);
          break;

        case "Search for a Song":
          getSong(searchKey);
          break;

        case "Search for a movie":
          getMovie(searchKey);
          break;

        case "Do something random":
          justDoIt();
          break;

        case "Nothing":
          console.log("Thanks for using Liri!\n");
          break;

        // default:
        //   console.log("Please enter a valid command. Check for typos ;)");
      }
    });
}

function getBandInfo(searchKey) {
  // bands in town API
  // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
  let bandActive = require("axios");
  bandActive.get(`https://rest.bandsintown.com/artists/${searchKey}?app_id=codingbootcamp`)
  .then(function (response) {
      let eventNumber = parseInt(response.data.upcoming_event_count);
      let moreInfoURL = response.data.url;
      if (eventNumber === 0) {
        console.log("It looks like that artist doesn't have any upcoming events. \n");
      } else {
        console.log("This artist has " + eventNumber + " upcoming events. Below are the next 3. \n");
        let bands = require("axios");
        bands.get(`https://rest.bandsintown.com/artists/${searchKey}/events?app_id=codingbootcamp`)      
        .then(function (response) {
            for (let i = 0; i < 3; i++) {
              console.log(response.data[i].venue.name); // * Name of the venue

              //format location
              let country = response.data[i].venue.country;  // * Venue country location
              let city = response.data[i].venue.city; // * Venue city location
              let location = (city + ", " + country);
              console.log(location);

              //format date    
              let concertDate = response.data[i].datetime; // Date of the Event (use moment to format this as "MM/DD/YYYY")
              let date = moment.utc(concertDate);
              let convertedDate = date.format("MM/DD/YYYY");
              console.log(convertedDate);
              console.log("\n");
            }
            console.log("For more events please visit the URL below: \n");
            console.log(moreInfoURL + "\n");
            //prompt user again for next search
            actionPrompt();

          });
      }
    });
}

function getSong(searchKey) {
  // TODO: If no song is provided then your program will default to "The Sign" by Ace of Base.
  searchKey = searchKey.replace('+', ' ');
  spotify.search({ type: 'track', query: searchKey }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {

      for (let i = 0; i < 5; i++) {
        console.log(data.tracks.items[i].artists[0].name); // artist name
        console.log(data.tracks.items[i].external_urls.spotify); //link of the song
        console.log(data.tracks.items[i].name); //name of song
        console.log(data.tracks.items[i].album.name); //name of the album it belongs to   
        console.log("\n");
      }
    }
  });
  //prompt user again for next search
  actionPrompt();
}

function getMovie() {
  // omdb API
  let movies = require("axios");
  movies.get("http://www.omdbapi.com/?t=the+notebook&y=&plot=short&apikey=trilogy").then(
    function (response) {
      console.log(response.data.Title); // * Title of the movie.
      console.log(response.data.Year); // * Year the movie came out.
      console.log(response.data.Ratings[0].Value); // * IMDB Rating of the movie.
      console.log(response.data.Ratings[1].Value); // * Rotten Tomatoes Rating of the movie.
      console.log(response.data.Country); // * Country where the movie was produced.
      console.log(response.data.Language); // * Language of the movie.
      console.log(response.data.Plot); // * Plot of the movie.
      console.log(response.data.Actors);  // * Actors in the movie.
    }
  );
  //prompt user again for next search
  actionPrompt()
}

function justDoIt() {
  // * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  // * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
  // * Edit the text in random.txt to test out the feature for movie-this and concert-this.

}