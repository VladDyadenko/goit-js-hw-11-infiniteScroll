import {refs} from "./refsElement"
const {galleryEl} = refs;

export default function murkupCardFoto(values) {
  let arrayFoto = values.hits;

  let murkupFotoLists =  arrayFoto.map(foto => 
  murkupCardList(foto))
  .join('')
  galleryEl.insertAdjacentHTML('beforeend', murkupFotoLists)
}

function murkupCardList({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
  return `<div class="container">
   <article class=" post gallery__item" href="${largeImageURL}"><img class="gallery__image" src=${webformatURL}" alt="${tags}" loading="lazy" width= 250;/></article>
  <div class="info">
      <p class="info__item">
        <b class="info__bold">Likes ${likes}</b>
      </p>
      <p class="info__item">
        <b class="info__bold">Views ${views}</b>
      </p>
      <p class="info__item">
        <b class="info__bold">Comments ${comments}</b>
      </p>
      <p class="info__item">
        <b class="info__bold">Downloads ${downloads}</b>
      </p>
  </div>
  </div>`;
}
  