import axios from "axios";

// Esta es mi llave de la API
const API_KEY= '7OGgeZ6pRanb4rSA2ya7oUs3qBn7MMpIkN6GAaTy'

// Estas son variables según cada ruta, ya que vienen parametradas
const startDate = new Date().toISOString().split('T')[0]; // Fecha de hoy
const solMars = 1000

// Varible que representa la URL de la NASA Base
const NasaURL = axios.create({
    baseURL: 'https://api.nasa.gov/',
    timeout: 90000
})

// Fetch para APOD (contiene la API key)
export const APODFetch = () => {
   return NasaURL.get(`/planetary/apod?api_key=${API_KEY}`)
}

// Fetch para conocer los asteroides (contiene la API key)
export const AsteroidFetch = () => {
    return NasaURL.get(`/neo/rest/v1/feed?start_date=${startDate}&api_key=${API_KEY}`)
}

// Fetch para las fotos de EPIC (contiene la API key)
export const EPICFetch = () => {
    return NasaURL.get(`/EPIC/api/natural?api_key=${API_KEY}`)
}

//   Esta es una API gratuita de fotos de Marte que no tiene la API key
export const MarsRoverPhotosFetch = (page: number) => {
    return NasaURL.get("/mars-photos/api/v1/rovers/curiosity/photos", {
      params: {
        sol: solMars,
        page,
        api_key: API_KEY,
      },
    });
  };

// Se va a hacer el cambio del parámetro 'galaxy' para que pueda aceptar cualquier valor
// Inicialmente, solo tenía el de galaxy pero después fue adaptado a un buscador de la NASA
export const NasaImageFetch = (query: string) => {
    const q = encodeURIComponent(query.trim());
    return axios.get(`https://images-api.nasa.gov/search?q=${q}&media_type=image`);
  };