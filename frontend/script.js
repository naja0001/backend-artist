"use strict";
import {
  endpoint,
  getArtists,
  createArtist,
  deleteArtist,
  updateArtist,
} from "./rest-service.js";

import { inputSearchChanged, sortBy, filterArtistChanged } from "./helpers.js";

export { artists, showArtist };

endpoint;
window.addEventListener("load", start);
let artists;

function start() {
  updateArtistsGrid(); // update the grid of posts: get and show all posts

  // event listener
  document
    .querySelector("#btn-create-artist")
    .addEventListener("click", showCreateArtistDialog);
  document
    .querySelector("#form-create-artist")
    .addEventListener("submit", createArtist);
  document
    .querySelector("#form-update-artist")
    .addEventListener("submit", updateArtistClicked);
  document
    .querySelector("#form-delete-artist")
    .addEventListener("submit", deleteArtistClicked);
  document
    .querySelector("#form-delete-artist .btn-cancel")
    .addEventListener("click", deleteCancelClicked);

  document.querySelector("#sortby").addEventListener("change", sortBy);
  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);

  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
}

// ============== events ============== //

function showCreateArtistDialog() {
  document.querySelector("#dialog-create-artist").showModal(); // show create dialog
}

async function deleteArtistClicked(event) {
  console.log(event);
  const id = event.target.getAttribute("data-id");
  const response = await deleteArtist(id);
  if (response.ok) {
    deleteArtist(id);
    updateArtistsGrid();
  }
  document.querySelector("#dialog-delete-artist").close();
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-artist").close(); // close dialog
}

// ============== posts ============== //

function showArtists(listOfArtists) {
  const artistsContainer = document.querySelector("#artists");
  artistsContainer.innerHTML = ""; // Clear the existing content

  for (const artist of listOfArtists) {
    showArtist(artist);
  }
}

function showArtist(artistObject) {
  const html = /*html*/ `
        <article class="grid-item">
            <button id="fav" ${artistObject.id}>Favorite</button>
            <img src="${artistObject.image}" />
            <h3>${artistObject.name}</h3>
            <p>${artistObject.shortDescription}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
  document.querySelector("#artists").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  // add event listeners to .btn-delete and .btn-update

  //------------------- Update  ----------------------//

  document
    .querySelector("#artists article:last-child .btn-update")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      updateClicked(artistObject);
    });

  //------------------- Delete  ----------------------//

  document
    .querySelector("#artists article:last-child .btn-delete")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      deleteClicked(artistObject);
    });

  //------------------- Show  ----------------------//

  document
    .querySelector("#artists article:last-child")
    .addEventListener("click", () => artistClicked(artistObject)); // called when delete button is clicked

  function deleteClicked(artistObject) {
    // show title of post you want to delete
    document.querySelector("#dialog-delete-artist-title").textContent =
      artistObject.name;
    // set data-id attribute of post you want to delete (... to use when delete)
    document
      .querySelector("#form-delete-artist")
      .setAttribute("data-id", artistObject.id);
    // show delete dialog
    document.querySelector("#dialog-delete-artist").showModal();
  }

  // called when update button is clicked
  function updateClicked(artistObject) {
    const updateForm = document.querySelector("#form-update-artist"); // reference to update form in dialog
    updateForm.updateName.value = artistObject.name; // set title input in update form from post title
    updateForm.updateBirthdate.value = artistObject.birthdate; // set body input in update form post body
    updateForm.updateActiveSince.value = artistObject.activeSince; // set image input in update form post image
    updateForm.updateGenres.value = artistObject.genres; // set image input in update form post image
    updateForm.updateLabels.value = artistObject.labels; // set image input in update form post image
    updateForm.updateWebsite.value = artistObject.website; // set image input in update form post image
    updateForm.updateImage.value = artistObject.image; // set image input in update form post image
    updateForm.updateShortDescription.value = artistObject.shortDescription; // set image input in update form post image
    updateForm.setAttribute("data-id", artistObject.id); // set data-id attribute of post you want to update (... to use when update)
    document.querySelector("#dialog-update-artist").showModal(); // show update modal
  }
}

function updateArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs in the form
  const name = form.updateName.value;
  const birthdate = form.updateBirthdate.value;
  const activeSince = form.updateActiveSince.value;
  const genres = form.updateGenres.value;
  const labels = form.updateLabels.value;
  const website = form.updateWebsite.value;
  const image = form.updateImage.value;
  const shortDescription = form.updateShortDescription.value;
  // get id of the post to update - saved in data-id
  const id = form.getAttribute("data-id");
  updateArtist(
    id,
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription
  ); // call updatePost with arguments
}

function sortByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "genres") {
    artists.sort(compareGenres);
  } else if (selectedValue === "labels") {
    artists.sort(compareLabels);
  }

  showArtists(artists);
}

// ============== posts ============== //

async function updateArtistsGrid() {
  artists = await getArtists();
  console.log("Artists data from server:", artists); // Add this line to check the data
  showArtists(artists);
}

//-------------------Show Dialog----------------------//
function artistClicked(artistObject) {
  console.log("Detail view opened");
  showDialog(artistObject);
  document.querySelector("#dialog-show").showModal();
}

function showDialog(artistObject) {
  document.querySelector("#show-image").src = artistObject.image;
  document.querySelector("#show-name").textContent = artistObject.name;
  document.querySelector("#show-shortDescription").textContent =
    artistObject.shortDescription;
  document.querySelector(
    "#show-birthdate"
  ).textContent = ` ${artistObject.name} is born ${artistObject.birthdate}`;
  document.querySelector(
    "#show-genres"
  ).textContent = ` ${artistObject.name} plays ${artistObject.genres}`;
  document.querySelector(
    "#show-activeSince"
  ).textContent = ` ${artistObject.name} have been in the industry since ${artistObject.activeSince}`; // Ændret til "activeSince"
  document.querySelector(
    "#show-website"
  ).textContent = `You can read more about ${artistObject.name} on her website: ${artistObject.website}`;
}

// ============== helper function ============== //
function prepareData(dataObject) {
  const array = Object.values(dataObject); // Convert the object values to an array
  return array; // return the array of artists
}
