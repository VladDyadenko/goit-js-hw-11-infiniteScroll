import { userDataAPIPixabay, GetFotoPromisAPI } from './js/getRequest.js';
import murkupCardFoto from './js/murkupListFoto.js';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refsElement.js';
const { galleryEl, form, btnOpenMoreFoto } = refs;

const getFotoPromisAPI = new GetFotoPromisAPI(userDataAPIPixabay);

form.addEventListener('submit', onSearch);
async function onSearch(e) {
  e.preventDefault();

  clearGallery();

  getFotoPromisAPI.valueForSearch = form.searchQuery.value.trim();

  if (!getFotoPromisAPI.valueForSearch) {
    return;
  }
  getFotoPromisAPI.resetPage();
  clearGallery();

  await getFotoPromisAPI
    .axiosGallery()
    .then(data => {
      murkupCardFoto(data);
      lightbox.refresh();
      scrollSmoothFoto(data);

      const { hits, totalHits } = data;

      if (hits.length === 0) {
        clearGallery();
        btnOpenMoreFoto.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (hits.length > 0) {
        Notify.success(`Hooray! We found totalHits ${totalHits} images.`);
      }

      if (hits.length < 40 && hits.length > 0) {
        noFotosToView();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

let index = 0;

async function getMoreFoto() {
  index += 1;

  getFotoPromisAPI.incrementPage();
  await getFotoPromisAPI.axiosGallery().then(data => {
    murkupCardFoto(data);
    lightbox.refresh();

    const { hits, totalHits } = data;

    let lastHits = totalHits - hits.length * index;

    let allFotoOnGallery = galleryEl.childNodes.length;
    scrollSmoothFoto(allFotoOnGallery);

    if (hits.length === userDataAPIPixabay.perPage) {
      Notify.info(`${lastHits} more photos available for viewing.`);
    }

    if (
      lastHits < userDataAPIPixabay.perPage ||
      allFotoOnGallery === totalHits
    ) {
      noFotosToView();
      return;
    }
  });
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function noFotosToView() {
  const messageLastFhoto = `<p class = gallery__massege>We're sorry, but you've reached the end of search results!</p>`;
  galleryEl.insertAdjacentHTML('beforeend', messageLastFhoto);
}

let lightbox = new SimpleLightbox('.container article', {
  captionDelay: 250,
  enableKeyboard: true,
});

window.addEventListener('scroll', function (e) {
  if (
    this.window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    getMoreFoto();
  }
});

function scrollSmoothFoto(data) {
  if (data > 40) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
