"use strict";

export { endpoint, getArtists, createArtist, deleteArtist, updateArtist };

const endpoint = "http://localhost:5001";

async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}

//-------------------Create Artist----------------------//

async function createArtist(
  image,
  name,
  shortDescription,
  birthdate,
  labels,
  genres,
  activeSince,
  website
) {
  const newArtist = {
    image: image,
    name: name,
    shortDescription: shortDescription,
    birthdate: birthdate,
    labels: labels,
    genres: genres,
    activeSince: activeSince,
    website: website,
  };
  const postAsJson = JSON.stringify(newArtist);

  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: postAsJson,
  });

  if (response.ok) {
    console.log("RESPONSE IS OK");
  } else {
    console.error("error");
  }
}

//-------------------Update Artist----------------------//

async function updateArtist(
  id,
  image,
  name,
  shortDescription,
  birthdate,
  genres,
  labels,
  activeSince,
  website
) {
  const updatedArtist = {
    image: image,
    name: name,
    shortDescription: shortDescription,
    birthdate: birthdate,
    genres: genres,
    labels: labels,
    activeSince: activeSince,
    website: website,
  };

  const json = JSON.stringify(updatedArtist);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PUT",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("RESPONSE IS OK");
  } else {
    console.error("error");
  }
}

//-------------------Delete Artist----------------------//

async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  return response;
}
