// TODO: finish the bulk search feat, resumit code to git, record the video, add to google folder


require('dotenv').config();

let moment = require('moment');

let keys = require('./keys.js');

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

let inquirer = require("inquirer");

let axios = require('axios');

// fs is a core Node package for reading and writing files
let fs = require("fs");

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

      // write the commands chosen and input entered into log file
      fs.appendFile("log.txt", "\n" + getTime() + " action chosen: ", function (err) {
        if (err) { console.log(err); }
      });
      fs.appendFile("log.txt", getTime() + action + " \n", function (err) {
        if (err) { console.log(err); }
      });
      fs.appendFile("log.txt", "\n" + getTime() + " search key entered: ", function (err) {
        if (err) { console.log(err); }
      });
      fs.appendFile("log.txt", searchKey + " \n", function (err) {
        if (err) { console.log(err); }
      });

      // make a case so that liri listens to any of the 4 specific commands available
      switch (action) {
        case "Search for a Band":
          getBandInfo(searchKey);
          break;

        case "Search for a Song":
          getSong(searchKey);
          break;

        case "Search for a movie":
          // if (searchKey === null){
          //   searchKey = "beautiful+mind"
          // }
          getMovie(searchKey);
          break;

        case "Bulk Search from random.txt":
          bulkSearch();
          break;

        case "Quit":
          console.log("Thanks for using Liri!\n");
          break;
      }
    });
}


//funtion to return current time
function getTime() {
  let current_time = new moment().format("MM-DD-YYYY HH:mm:ss");
  return current_time
}

//search for a band
function getBandInfo(searchKey) {

  //write to log file
  fs.appendFile("log.txt", getTime() + "bands in town API query STR: ", function (err) {
    if (err) { console.log(err); }
  });
  fs.appendFile("log.txt", getTime() + `https://rest.bandsintown.com/artists/${searchKey}?app_id=codingbootcamp\n`, function (err) {
    if (err) { console.log(err); }
  });

  axios.get(`https://rest.bandsintown.com/artists/${searchKey}?app_id=codingbootcamp`)
    .then(function (response) {

      //write each of the responses into the log file in a pretty format
      for (let key in response.data) {
        fs.appendFile("log.txt", getTime() + key + ": " + response.data[key] + "\n", function (err) {
          if (err) { console.log(err); }
        });
      }

      let eventNumber = parseInt(response.data.upcoming_event_count);
      let moreInfoURL = response.data.url;
      if (eventNumber === 0) {
        console.log("\n It looks like that artist doesn't have any upcoming events. \n");
        actionPrompt();
      } else {
        console.log("This artist has " + eventNumber + " upcoming events. Below are the next 3. \n");
        axios.get(`https://rest.bandsintown.com/artists/${searchKey}/events?app_id=codingbootcamp`)
          .then(function (response) {

            //write each of the responses into the log file in a pretty format
            for (let key in response.data) {
              fs.appendFile("log.txt", getTime() + key + ": " + response.data[key] + "\n", function (err) {
                if (err) { console.log(err); }
              });
            }

            // output the next three concerts
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
    }).catch(e => {
      console.log(e);
    });
}

// search for a song using spotify's api
function getSong(searchKey) {

  searchKey = searchKey.replace('+', ' ');

  // If no song is provided then your program will default to "The Sign" by Ace of Base.
  if (searchKey === "") {
    searchKey = "The+Sign"
  }

  //write to log file
  fs.appendFile("log.txt", getTime() + "Spotify API query STR: ", function (err) {
    if (err) { console.log(err); }
  });
  fs.appendFile("log.txt", getTime() + `https://rest.bandsintown.com/artists/${searchKey}?app_id=codingbootcamp\n`, function (err) {
    if (err) { console.log(err); }
  });

  spotify.search({ type: 'track', query: searchKey }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {

      // store the top 5 results from the database
      let resp = [];

      for (let i = 0; i < 5; i++) {
        resp.push(`Name of Artist: ${data.tracks.items[i].artists[0].name}`); // artist name
        resp.push(`Link to the song: ${data.tracks.items[i].external_urls.spotify}`); //link of the song
        resp.push(`Name of Song: ${data.tracks.items[i].name}`); //name of song
        resp.push(`Album name: ${data.tracks.items[i].album.name}`); //name of the album it belongs to   
        resp.push("\n");
      }

      // output the responses to the screen and also log them
      for (let i = 0; i < resp.length; i++) {
        console.log(resp[i]);
        fs.appendFile("log.txt", getTime() + resp[i] + "\n", function (err) {
          if (err) { console.log(err); }
        });

      }
      // automatically prompt user again for next search
      actionPrompt();
    }
  });
}

// search for a movie using ombd api
function getMovie(searchKey) {

  // If no movie is provided then your program will default to selena.
  if (searchKey === "") {
    searchKey = "selena"
  }

  //write to log file
  fs.appendFile("log.txt", "\n" + getTime() + " Movie API query STR: ", function (err) {
    if (err) { console.log(err); }
  });
  fs.appendFile("log.txt", getTime() + `http://www.omdbapi.com/?t=${searchKey}&y=&plot=short&apikey=trilogy\n`, function (err) {
    if (err) { console.log(err); }
  });

  axios.get(`http://www.omdbapi.com/?t=${searchKey}&y=&plot=short&apikey=trilogy`).then(
    function (response) {

      //write response to screen and to log file
      let respArr = [];
      respArr.push(`Tittle of the Movie: ${response.data.Title}`); // * Title of the movie.
      respArr.push(`Year of the movie: ${response.data.Year}`); // * Year the movie came out.
      respArr.push(`IMDB Rating of the movie: ${response.data.Ratings[0].Value}`); // * IMDB Rating of the movie.
      respArr.push(`Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}`); // * Rotten Tomatoes Rating of the movie.
      respArr.push(`Country where the movie was produced: ${response.data.Country}`); // * Country where the movie was produced.
      respArr.push(`Language of the movie: ${response.data.Language}`); // * Language of the movie.
      respArr.push(`Plot of the movie: ${response.data.Plot}`); // * Plot of the movie.
      respArr.push(`Actors in the movie: ${response.data.Actors}`);  // * Actors in the movie.

      for (let i = 0; i < respArr.length; i++) {
        console.log(respArr[i] + "\n");
        fs.appendFile("log.txt", getTime() + respArr[i] + "\n", function (err) {
          if (err) { console.log(err); }
        });
      }
      //prompt user again for next search
      actionPrompt();
    }
  );
}

//search from the random.txt file queries
function bulkSearch() {

  //write to log file
  fs.appendFile("log.txt", getTime() + " Running searches from random.txt ", function (err) {
    if (err) { console.log(err); }
  });
  console.log("Running searches from random.txt ");

  try {

    // read from the "random.txt" file and store content in "data"
    fs.readFile("random.txt", "utf8", async function (error, data) {

      if (error) {
        return console.log(error);
      }

      // Then split it by new lines (to make it more readable) and store it into separate arrays
      let dataArr = data.split("\n");
      let results = [];
      let movRespArr = [];
      let bandRespArr = [];
      const bands = dataArr[0].split(",");
      const songs = dataArr[1].split(",");
      const movies = dataArr[2].split(",");


     // search for songs
      // for (let i = 0; i < songs.length; i++) {
      //   const spotified = await spotify.search({ type: 'track', query: songs[i] }, function (err, data) {
      //     if (err) {
      //       return console.log('Error occurred: ' + err);
      //     } else {

      //       // store the top 5 results from the database
      //       let resp = [];

      //       for (let i = 0; i < 5; i++) {
      //         resp.push(`Name of Artist: ${data.tracks.items[i].artists[0].name}`); // artist name
      //         // resp.push(`Link to the song: ${data.tracks.items[i].external_urls.spotify}`); //link of the song
      //         // resp.push(`Name of Song: ${data.tracks.items[i].name}`); //name of song
      //         // resp.push(`Album name: ${data.tracks.items[i].album.name}`); //name of the album it belongs to   
      //         // resp.push("\n");
      //       }
      //       results.push(result.data);
      //     }
      //   });
      // }//end of search for loop

      //search for movies
      for (let i = 0; i < movies.length; i++) {
        const result = await axios.get(`http://www.omdbapi.com/?t=${movies[i]}&y=&plot=short&apikey=trilogy`);
        //write response to screen and to log file
        movRespArr.push(`Tittle of the Movie: ${result.data.Title}`); // * Title of the movie.
        movRespArr.push(`Year of the movie: ${result.data.Year}`); // * Year the movie came out.
        movRespArr.push(`IMDB Rating of the movie: ${result.data.Ratings[0].Value}`); // * IMDB Rating of the movie.
        movRespArr.push(`Rotten Tomatoes Rating of the movie: ${result.data.Ratings[1].Value}`); // * Rotten Tomatoes Rating of the movie.
        movRespArr.push(`Country where the movie was produced: ${result.data.Country}`); // * Country where the movie was produced.
        movRespArr.push(`Language of the movie: ${result.data.Language}`); // * Language of the movie.
        movRespArr.push(`Plot of the movie: ${result.data.Plot}`); // * Plot of the movie.
        movRespArr.push(`Actors in the movie: ${result.data.Actors}`);  // * Actors in the movie.

        results.push(movRespArr);
        movRespArr = []; // empty the response array
      }

      // search for each band provided
      for (let i = 0; i < bands.length; i++) {
        const response = await axios.get(`https://rest.bandsintown.com/artists/${bands[i]}/events?app_id=codingbootcamp`);

        // console.log(bands[i]); // artist name print to screen
        results.push("Artist: "+bands[i]); //artist name pushed to the results array
        bandRespArr = [];

        // output the next three concerts for each artist provided
        for (let i = 0; i < 3; i++) {
          bandRespArr.push(response.data[i].venue.name); // * Name of the venue

          // format location
          let country = response.data[i].venue.country;  // * Venue country location
          let city = response.data[i].venue.city; // * Venue city location
          let location = (city + ", " + country);
          bandRespArr.push(location);

          //format date    
          let concertDate = response.data[i].datetime; // Date of the Event (use moment to format this as "MM/DD/YYYY")
          let date = moment.utc(concertDate);
          let convertedDate = date.format("MM/DD/YYYY");
          bandRespArr.push(convertedDate);
          bandRespArr.push("\n");

          results.push(bandRespArr);
          bandRespArr = [];
        }//end of loop for events from a band
        
      } // end loop for the bands

      //write to screen 
      console.log("results", results);

      //write to log file
      fs.appendFile("log.txt", getTime() + results, function (err) {
        if (err) { console.log(err); }
      });

    });// end of read file function
  } catch (e) {
    console.log(e);
  }
} //end of bulkSearch()