import getImagesBySearchParam from './api/pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', handlerSubmitForm);
loadMoreBtn.addEventListener('click', onClickLoadMore);

let numberPage = 1;
let inputValue = null;
const perPage = 10;

async function handlerSubmitForm(e) {
  e.preventDefault();

  inputValue = e.target.elements.searchQuery.value;
  numberPage = 1;
  galleryEl.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  try {
    await getImages();
    console.log(totalHits);
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    if (numberPage * perPage >= totalHits) {
      appendImagesMarkup(hits);
      createSimpleLightbox();
      loadMoreBtn.classList.add('is-hidden');
      return;
    }

    appendImagesMarkup(hits);
    createSimpleLightbox();
    loadMoreBtn.classList.remove('is-hidden');
  } catch (e) {
    console.log(e);
  }
}

function createMarkUp(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        downloads,
        comments,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" title="${tags}"/>
  </a>

  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>View: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}

function appendImagesMarkup(hits) {
  galleryEl.insertAdjacentHTML('beforeend', createMarkUp(hits));
}

async function onClickLoadMore() {
  try {
    numberPage += 1;
    getImages();
    if (numberPage * perPage >= totalHits) {
      appendImagesMarkup(hits);
      createSimpleLightbox();
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    appendImagesMarkup(hits);
    createSimpleLightbox();
    loadMoreBtn.classList.remove('is-hidden');
  } catch (e) {
    console.log(e);
  }
}

function createSimpleLightbox() {
  const lightbox = new SimpleLightbox('.gallery a');
}

async function getImages() {
  return ({ hits, totalHits } = await getImagesBySearchParam(
    inputValue,
    numberPage,
    perPage
  ));
}

console.log(getImages());
