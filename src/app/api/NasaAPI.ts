import axios from "axios";

// Esta es mi llave de la API
const API_KEY= '7OGgeZ6pRanb4rSA2ya7oUs3qBn7MMpIkN6GAaTy'

// Estas son variables según cada ruta, ya que vienen parametradas
const startDate = new Date().toISOString().split('T')[0]; // Fecha de hoy
const solMars = 1000
const ImageNasaQuery = 'galaxy'


const NasaURL = axios.create({
    baseURL: 'https://api.nasa.gov/',
    timeout: 90000
})

export const APODFetch = () => {
   return NasaURL.get(`/planetary/apod?api_key=${API_KEY}`)
}

export const AsteroidFetch = () => {
    return NasaURL.get(`/neo/rest/v1/feed?start_date=${startDate}&api_key=${API_KEY}`)
}

export const EPICFetch = () => {
    return NasaURL.get(`/EPIC/api/natural?api_key=${API_KEY}`)
}

export const MarsRoverPhotosFetch = (page: number) => {
    return NasaURL.get(`/mars-photos/api/v1/rovers/curiosity/photos?sol=${solMars}&api_key=${API_KEY}`)
}

export const NasaImageFetch = () => {
    // Esta ruta es pública
    return axios.get(`https://images-api.nasa.gov/search?q=${ImageNasaQuery}`)
}