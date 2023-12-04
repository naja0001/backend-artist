"use strict";
const endpoint = "http://localhost:5001";

export { endpoint, inputSearchChanged, sortBy, filterArtistChanged };
import { artists, showArtist } from "./script.js";

function inputSearchChanged(event) {
  const value = event.target.value;
  const artistToShow = searchArtist(value);
  showArtist(artistToShow);
}

const searchArtist = (searchValue) => {
  const searchValues = searchValue.toLowerCase();

  return artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchValues)
  );
};

function sortBy(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "name") {
    artists.sort((artist1, artist2) =>
      artist1.name.localeCompare(artist2.name)
    );
  } else if (selectedValue === "birthdate") {
    artists.forEach((artist) => {
      if (typeof artist.birthdate === "string") {
        artist.birthdate = new Date(artist.birthdate);
      }
    });
    artists.sort((artist1, artist2) => artist1.birthdate - artist2.birthdate);
  }

  showArtist(artists);
}

async function filterArtistChanged(event) {
  const value = event.target.value;
  console.log(value);
  if (value === "favourites") {
    const artistToShow = await filterArtist(value);
    showArtist(artistToShow);
  } else if (value === "allArtists") {
    showArtist(artists);
  }
}

async function filterArtist() {
  const data = await fetch(`${endpoint}/favorites`);
  const artists = await data.json();
  showArtist(artists);
  return artists;
}
