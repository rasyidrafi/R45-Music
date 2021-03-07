var express = require("express");
var bodyParser = require("body-parser");
var axios = require("axios");
var ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytlist = require("ytpl");

const config = require("./config");

var app = express();

app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/views");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

app.get("/", async (req, res) => {
  res.render("lobby.html");
});

app.get("/yt", async (req, res) => {
  if (req.query.url) {
    const hasil = await ytdl.getInfo(req.query.url);
    const jsonnya = hasil.formats;
    let direct = "";
    let long = hasil.videoDetails.thumbnails.length - 1;
    let thumb = hasil.videoDetails.thumbnails[long].url;
    let title = hasil.videoDetails.title;
    for (let i = 0; i < jsonnya.length; i++) {
      if (jsonnya[i].hasVideo == false) {
        direct = jsonnya[i].url;
      }
    }
    res.render("index.html", { direct: direct, title: title, thumb: thumb });
  } else if (req.query.judul) {
    yts(req.query.judul).then(async (result) => {
      let url = await result.all[0].url;
      const hasil = await ytdl.getInfo(url);
      const jsonnya = hasil.formats;
      let direct = "";
      let long = hasil.videoDetails.thumbnails.length - 1;
      let thumb = hasil.videoDetails.thumbnails[long].url;
      let title = hasil.videoDetails.title;
      for (let i = 0; i < jsonnya.length; i++) {
        if (jsonnya[i].hasVideo == false) {
          direct = jsonnya[i].url;
        }
      }
      res.render("index.html", { direct: direct, title: title, thumb: thumb });
    });
  } else if (req.query.playlist) {
    let awal = req.query.playlist;
    let link = awal.split("=")[1];
    ytlist(link).then(async (oi) => {
      let listRandom = getRandomInt(oi.items.length);
      let filterUrl = oi.items[listRandom].url.split("&")[0];

      const hasil = await ytdl.getInfo(filterUrl);
      const jsonnya = hasil.formats;
      let direct = "";
      let long = hasil.videoDetails.thumbnails.length - 1;
      let thumb = hasil.videoDetails.thumbnails[long].url;
      let title = hasil.videoDetails.title;
      for (let i = 0; i < jsonnya.length; i++) {
        if (jsonnya[i].hasVideo == false) {
          direct = jsonnya[i].url;
        }
      }
      res.render("index.html", { direct: direct, title: title, thumb: thumb });
    });
  } else {
    let custom = "";
    let list = [
      "PLeCdlPO-XhWFzEVynMsmosfdRsIZXhZi0",
      "PLhsz9CILh357zA1yMT-K5T9ZTNEU6Fl6n",
      custom,
      //Put our youtube playlist here
    ];

    let url = list[getRandomInt(2)];
    ytlist(url).then(async (oi) => {
      let listRandom = getRandomInt(oi.items.length);
      let filterUrl = oi.items[listRandom].url.split("&")[0];

      const hasil = await ytdl.getInfo(filterUrl);
      const jsonnya = hasil.formats;
      let direct = "";
      let long = hasil.videoDetails.thumbnails.length - 1;
      let thumb = hasil.videoDetails.thumbnails[long].url;
      let title = hasil.videoDetails.title;
      for (let i = 0; i < jsonnya.length; i++) {
        if (jsonnya[i].hasVideo == false) {
          direct = jsonnya[i].url;
        }
      }
      res.render("index.html", { direct: direct, title: title, thumb: thumb });
    });
  }
});

app.get("/joox", async (req, res) => {
  if (req.query.judul) {
    axios
      .get(
        `https://mnazria.herokuapp.com/api/jooxnich?search=${req.query.judul}`
      )
      .then(async (hasil) => {
        let thumb = hasil.data.result.album_url;
        let title = hasil.data.result.msong;
        let direct = hasil.data.result.mp3Url;
        res.render("index.html", {
          direct: direct,
          title: title,
          thumb: thumb,
        });
      });
  } else {
    res.send("Masukkan parameter judul");
  }
});

let PORT = config.PORT;
app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
