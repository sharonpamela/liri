#LIRI 

Liri is a command line node app that interprets language, processes as parameters, and returns data to the user. 


Usage: 
This version of Liri is able to do the following:

Upon starting the application in node, it presents a menu of choices as shown below:

"""
What would you like to do? (Use arrow keys)
❯ Search for a Band 
  Search for a Song 
  Search for a movie 
  Bulk Search from random.txt 
  Quit
"""

Using the arrow keys, navigate to desired option and press enter, which will prompt with another question related to the specific action desired. 

"""
What would you like to searh for? (leave blank for 'Bulk Search' and 'Quit' options) 
"""

Here the user enters the query they would like to search if it applies or leaves it empty if trying to quit or perform a bulk search. 

Capabilities:

Search for a Band: searches for upcoming shows for a music band or artist. Says the total amount of shows found but only shows the next upcoming 3 shows and provides a link to view all other shows. 

Search for a Song: searches for song name provided in the Spotify databases and displays the top 5 results that partically or completely match the search query. 

Search for a movie: searches for the information of whatever movie provided. 

Bulk Search from random.txt: utilizes the contents of a file named "random.txt" to execute searches automatically and present all the data to the user.  

The format of the file needs to be 3 lines as follows:
First line: artist you want to search their concerts
Second line: songs you want to search for.
Third line: movies you want to search for. 

Notes:
For the first and second lines: needs to be comma separated with no spaces in between commas. spaces between the artist or song name are ok.
For the third line: needs to be comma separated with no spaces in between commas. A + between two or more word in a movie name is required.

Example:
gaga,arianna grande
I Want it That Way,girls like you
the+notebook,rocky

Quit: quit without searching. 

Note: all of the activity containing the queries searched for as well as the responses are also logged into a file called log.txt with a timestamp. 