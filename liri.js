

require('dotenv').config();

let moment = require('moment');

let keys = require('./keys.js');

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

let inquirer = require("inquirer");

//boolean to detect whether the current is a bulk search or not to limit the prompts
// let isBulkSearch = false;

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
        choices: ["Search for a Band", "Search for a Song", "Search for a movie", "Bulk Search from random.txt", "Quit\n"],
        name: "action"
      },
      {
        message: "What would you like to searh for? (leave blank for 'Bulk Search' and 'Quit' options)",
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

        case "Bulk Search from random.txt":
          justDoIt();
          break;

        case "Quit":
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
        console.log(`Name of Artist: ${data.tracks.items[i].artists[0].name}`); // artist name
        console.log(`Link to the song: ${data.tracks.items[i].external_urls.spotify}`); //link of the song
        console.log(`Name of Song: ${data.tracks.items[i].name}`); //name of song
        console.log(`Album name: ${data.tracks.items[i].album.name}`); //name of the album it belongs to   
        console.log("\n");
      }
      //prompt user again for next search
      actionPrompt();
    }
  });
}

function getMovie(searchKey) {
  // omdb API
  let movies = require("axios");
  movies.get(`http://www.omdbapi.com/?t=${searchKey}&y=&plot=short&apikey=trilogy`).then(
    function (response) {
      console.log(`Tittle of the Movie: ${response.data.Title}`); // * Title of the movie.
      console.log(`Year of the movie: ${response.data.Year}`); // * Year the movie came out.
      console.log(`IMDB Rating of the movie: ${response.data.Ratings[0].Value}`); // * IMDB Rating of the movie.
      console.log(`Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}`); // * Rotten Tomatoes Rating of the movie.
      console.log(`Country where the movie was produced: ${response.data.Country}`); // * Country where the movie was produced.
      console.log(`Language of the movie: ${response.data.Language}`); // * Language of the movie.
      console.log(`Plot of the movie: ${response.data.Plot}`); // * Plot of the movie.
      console.log(`Actors in the movie: ${response.data.Actors}`);  // * Actors in the movie.
      console.log("\n");
      //prompt user again for next search
      actionPrompt();
    }
  );
}

function justDoIt() {
  // * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  // * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
  // * Edit the text in random.txt to test out the feature for movie-this and concert-this.

  // fs is a core Node package for reading and writing files
  let fs = require("fs");
  isBulkSearch = true;

  // This block of code will read from the "movies.txt" file.
  // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
  // The code will store the contents of the reading inside the variable "data"
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    
    // We will then print the contents of data
    // console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split("\n");

    for (let i=0;i<dataArr.length;i++){
      //let search = dataArr[i];
      //console.log(search);
      console.log("Executing the following commands from random.txt: ");
      console.log(dataArr[i]);
      console.log("\n");
      eval(dataArr[i]);
    }
    
    // if (isBulkSearch === true){
    //   actionPrompt();
    //   isBulkSearch = false;
    // }  
  });
}