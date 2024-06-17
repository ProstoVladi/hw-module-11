import axios from 'axios';
const API_KEY = '44417452-f1fca06557dde0ad7e2e33ebf';
const baseURL = 'https://pixabay.com/api/';

const pixabayApi = axios.create({ baseURL });

export default async function getImagesBySearchParam(
  searchEl,
  page = 1,
  perPage
) {
  const { data } = await pixabayApi(
    `?key=${API_KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  return data;
}
