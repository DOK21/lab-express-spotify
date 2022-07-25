require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
//AccessToken:
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("HomePage");
});
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      console.log("artist ", data.body.artists.items[0]);
      console.log("image", data.body.artists.items[0].url);
      res.render("artist-search-results", { artists: data.body.artists.items });

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res) => {
  // Get Elvis' albums
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render("albums", {
        albumArtistName: data.body.items[0].artists[0].name,
        albums: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get tracks in an album
app.get("/tracks/:albumId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 15, offset: 0 }).then(
    function (data) {
      res.render("tracks", {
        tracks: data.body.items,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});
// app.get("/albums/:albumId", (req, res, next) => {
//   spotifyApi.getArtistAlbums(
//     req.params.albumId,
//     { limit: 10, offset: 20 },
//     res.render("albums", {
//       albumArtistName: data.body.items[0].artists[0].name,
//       albums: data.body.items,
//     });
//   })
//     function (err, data) {
//       if (err) {
//         console.error("Something went wrong!");
//       } else {
//         console.log(data.body);
//       }
//     }
//   );
// });
app.listen(3200, () =>
  console.log("My Spotify project running on port 3200 🎧 🥁 🎸 🔊")
);
