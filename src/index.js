import getImagesBySearchParam from './api/pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', handlerSubmitForm);
loadMoreBtn.addEventListener('click', onClickLoadMore);

const arrSearchCard = [];
let totalImages = null;
let numberPage = null;
let inputValue = null;
const perPage = 10;

async function handlerSubmitForm(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  arrSearchCard.splice(0, arrSearchCard.length);
  numberPage = 1;
  inputValue = e.target.elements.searchQuery.value;

  await getAllImages(inputValue, numberPage, perPage);

  if (inputValue === '' || arrSearchCard.length <= 0) {
    Notify.warning('Please enter correct what you are looking for');
    return;
  } else {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  }

  if (numberPage * perPage < totalImages) {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

async function getAllImages(inputValue, numberPage, perPage) {
  try {
    const { hits, totalHits } = await getImagesBySearchParam(
      inputValue,
      numberPage,
      perPage
    );

    totalImages = totalHits;
    arrSearchCard.push(...hits);

    appendImagesMarkup(hits);
    createSimpleLightbox();
  } catch (error) {
    console.log(error);
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
  numberPage += 1;
  await getAllImages(inputValue, numberPage, perPage);
  if (numberPage * perPage >= totalImages) {
    loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  } else {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

function createSimpleLightbox() {
  const lightbox = new SimpleLightbox('.gallery a').refresh();
}
