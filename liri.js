

require('dotenv').config();

let moment = require('moment');

let keys = require('./keys.js');

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

console.log("What would you like to do?");
console.log("1. concert-this <name of band>");
console.log("2. spotify-this-song <name of song>");
console.log("3. movie-this <name of movie>");
console.log("4. do-what-it-says <reads and executes random.txt content>");

// Listen for user input
let whatToDo = process.argv[2];
let thingToDo = process.argv.slice(3).join('+');

// make a case so that liri listens to any of the 4 specific commands available
switch (whatToDo) {
  case "concert-this":
    console.log("entered concert-this");
    // bands in town API
    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    let bands = require("axios");
    let bandActive = require("axios");
    bandActive.get("https://rest.bandsintown.com/artists/arianna+grande?app_id=codingbootcamp").then(

      function (response) {
        let eventNumber = parseInt(response.data.upcoming_event_count);
        let moreInfoURL = response.data.url;
        if (eventNumber === 0) {
          console.log("It looks like that artist doesn't have any upcoming events. \n");
        } else {
          console.log("This artist has " + eventNumber + " upcoming events. Below are the next 3. \n");

          bands.get("https://rest.bandsintown.com/artists/arianna+grande/events?app_id=codingbootcamp").then(
            function (response) {
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
            });
        }
      });
    break;

  case "spotify-this-song":
    console.log("entered spotify-this-song");
    // TODO: If no song is provided then your program will default to "The Sign" by Ace of Base.
    spotify.search({ type: 'track', query: '7 rings' }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      } else {

        for (let i = 0; i < 5; i++) {
          console.log(data.tracks.items[i].artists[0].name); // artist name
          console.log(data.tracks.items[i].external_urls.spotify); //link of the song
          console.log(data.tracks.items[i].name); //name of song
          console.log(data.tracks.items[i].album.name); //name of the album it belongs to   
        }
      }
    });
    break;

  case "movie-this":
    console.log("entered movie-this");
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
    break;

  case "do-what-it-says":
    console.log("entered do-what-it-says");


    break;

  default:
    console.log("Please enter a valid command. Check for typos ;)");
}









