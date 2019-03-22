async function getSong(searchKey) {
  // TODO: If no song is provided then your program will default to "The Sign" by Ace of Base.
  searchKey = searchKey.replace('+', ' ');

  //write to log file
  fs.appendFile("log.txt", "Spotify API query STR: ", function (err) {
    if (err) { console.log(err); }
  });

  fs.appendFile("log.txt", `https://rest.bandsintown.com/artists/${searchKey}?app_id=codingbootcamp\n`, function (err) {
    if (err) { console.log(err); }
  });

  // spotify.search({ type: 'track', query: searchKey }, function (err, data) {
  //   if (err) {
  //     return console.log('Error occurred: ' + err);
  //   } else {

  //     fs.appendFile("log.txt", data + "\n", function (err) {
  //       if (err) { console.log(err); }
  //     });
  //     for (let i = 0; i < 5; i++) {
  //       console.log(`Name of Artist: ${data.tracks.items[i].artists[0].name}`); // artist name
  //       console.log(`Link to the song: ${data.tracks.items[i].external_urls.spotify}`); //link of the song
  //       console.log(`Name of Song: ${data.tracks.items[i].name}`); //name of song
  //       console.log(`Album name: ${data.tracks.items[i].album.name}`); //name of the album it belongs to   
  //       console.log("\n");
  //     }


  //     //prompt user again for next search
  //     actionPrompt();
  //   }
  // });
  try {
    const spotified = await spotify.search({ type: 'track', query: searchKey });
    

  } catch(e) {
    console.log(e);
  }

  



}
