import express from "express";
import cors from "cors";
import fs from "fs/promises";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("There we go");
});

app.listen(PORT, () => {
  console.log(`Serveren Kører på http://localhost:${PORT}`);
});

//----------------Get all artists--------------------
app.get("/artists", async (req, res) => {
  //fetch
  const data = await fs.readFile("artists.json");
  //convert to JSON
  const artists = JSON.parse(data);
  res.json(artists);
  console.log("artists found");
});

//----------------Get one artist--------------------

app.get("/artists/:id", async (req, res) => {
  //vis kun artist med samme id som url parms
  const id = Number(req.params.id);

  const data = await fs.readFile("artists.json");
  //convert to JSON
  const artists = JSON.parse(data);

  //finder den artist der matcher id med url id'et.
  const artistFound = artists.find((artist) => artist.id === id);

  if (!artistFound) {
    res.status(404).json({ message: "Artist not found" });
  }
  res.status(200).send(artistFound);
});

//----------------POST--------------------

app.post("/artists", async (req, res) => {
  //object stored in req.body
  const newArtist = req.body;
  newArtist.id = new Date().getTime();
  //newArtist.id = new Date().getTime();
  //fetch
  const data = await fs.readFile("artists.json");
  //convert to JSON
  const artists = JSON.parse(data);

  artists.push(newArtist);

  fs.writeFile("artists.json", JSON.stringify(artists));

  res.json(artists);

  console.log("New artist posted");
});

//----------------DELETE--------------------
app.delete("/artists/:id", async (req, res) => {
  const id = Number(req.params.id);

  const data = await fs.readFile("./artists.json");
  const artists = JSON.parse(data);

  const newArtist = artists.filter((artist) => artist.id !== id);

  fs.writeFile("artists.json", JSON.stringify(newArtist));

  res.json(artists);

  console.log(`artist with ${id} is now deleted from databse`);
});

//---------------update one artists--------------------

app.put("/artists/:id", async (req, res) => {
  //vis kun artist med samme id som url parms
  const id = Number(req.params.id);
  const updatedArtist = req.body;

  await fs.readFile("artists.json"), JSON.parse(data);

  let foundArtist = artists.find((artist) => artist.id === id);

  if (!foundArtist) {
    return res.status(404).json({ error: "Kunstneren blev ikke fundet." });
  }

  foundArtist.image = updatedArtist.image;
  foundArtist.name = updatedArtist.name;
  foundArtist.shortDescription = updatedArtist.shortDescription;
  foundArtist.birthdate = updatedArtist.birthdate;
  foundArtist.genres = updatedArtist.genres;
  foundArtist.activeSince = updatedArtist.activeSince;
  foundArtist.website = updatedArtist.website;
  foundArtist.id = updatedArtist.id;

  await fs.writeFile("artists.json"), JSON.stringify(artists);

  if (!foundArtist) {
    res.status(404).json({ error: "artist was not found" });
  }

  res.json(artists);
  console.log(artists);

  res.send(`artist with the id ${id} is now updated`);
});

//-------------------Favorites Artist backend----------------------//

app.get("/favorites", async (request, res) => {
  const id = Number(request.params.id);
  // console.log(id);
  const data = await fs.readFile("artists.json"); // Læs favoritartister fra favorites.json
  const artists = JSON.parse(data);
  const favArtists = artists.filter((artists) => artists.favourite === true);
  res.json(favArtists);
  // console.log(favArtists);
});
