/* ESTE ES UN ARCHIVO QUE TRANSFORMA LOS DATOS DE LA API A DATOS DE LA APLICACIÓN */
import { APODEntity } from "../../domain/entities/APODEntity";
import { AsteroidEntity } from "../../domain/entities/AsteroidEntity";
import { EPICEntity } from "../../domain/entities/EPICEntity";
import { MarsRoverPhotosEntity } from "../../domain/entities/MarsRoverPhotosEntity";
import { NasaImageEntity } from "../../domain/entities/NasaImageEntity";
/* PARA TODOS LOS MAPPINGS SE DEBE PONER EL PARÁMETRO RAW: ANY */
// Mapping de los datos del APOD a la entidad correspondiente
export const APODMap = (raw: any): APODEntity => ({
    // Raw son los valores crudos del fetch y any es que puede ser cualquier cosa
    date: raw.date,
    explanation: raw.explanation,
    hdurl: raw.hdurl,
    media_type: raw.media_type,
    service_version: raw.service_version,
    title: raw.title,
    url: raw.url
}); // Este es un map sencillo, ya que los datos del fetch no vienen en colección o divididos

// Mapping de los datos de la API de asteroides a la entidad correspondiente
export const AsteroidMap = (raw: any): AsteroidEntity[] => {
    // El fetch retorna los asteroides en un grupo, por ello se debe de aplanar
    const entries = Object.values(raw.near_earth_objects).flat();
    // El Object.values(...) convierte ese objeto en un array de arrays de asteroides
    // flat() aplana el array de arrays a un solo nivel de array con objetos asteroide
    return entries.map((asteroid: any) => ({
        // asteroid.name: nombre legible del asteroide
        name: asteroid.name,
        // asteroid.close_approach_data[0].close_approach_date: fecha de acercamiento
        close_approach_date: asteroid.close_approach_data[0].close_approach_date,
        // asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour: velocidad en km/h
        velocity_kph: asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour,
        // asteroid.close_approach_data[0].miss_distance.kilometers: distancia mínima en km
        miss_distance_km: asteroid.close_approach_data[0].miss_distance.kilometers,
        // asteroid.is_potentially_hazardous_asteroid: booleano de riesgo de impacto
        is_potentially_hazardous_asteroid: asteroid.is_potentially_hazardous_asteroid
    }));
}

// Mapping de los datos de EPIC a la entidad correspondiente
export const EPICMap = (raw: any[]): EPICEntity[] => {
    // El raw: any[] es porque son array los datos 
    return raw.map(item => ({
        // Esta es una iteración de cada dato crudo
        // Se convierta a un valor de la entidad
        // item.identifier: ID único de la imagen
        identifier: item.identifier,
        // item.caption: texto descriptivo
        caption: item.caption,
        // item.image: nombre de archivo de la imagen
        image: item.image,
        // item.version: versión de la API EPIC
        version: item.version,
        // item.date: fecha y hora en que se tomó la imagen
        date: item.date,
        // item.centroid_coordinates: coordenadas lat/lon del centro de la imagen
        centroid_coordinates: item.centroid_coordinates,
        // item.dscovr_j2000_position, lunar_j2000_position, sun_j2000_position:
        // posiciones en coordenadas J2000 para satélite, Luna y Sol respectivamente
        dscovr_j2000_position: item.dscovr_j2000_position,
        lunar_j2000_position: item.lunar_j2000_position,
        sun_j2000_position: item.sun_j2000_position,
        // item.attitude_quaternions: cuaterniones de actitud del satélite DSCOVR
        attitude_quaternions: item.attitude_quaternions
    }))
}

// Mapping de los datos de Mars Rover a la entidad correspondiente
export const MarsRoverMap = (raw: any): MarsRoverPhotosEntity[] => {
    // La respuesta viene en raw.photos (array).
    return raw.photos.map((photo: any) => ({
        // De nueva cuenta, esta es una iteración de raw para cada valor de la entidad
        // photo.id: ID de la foto
        id: photo.id,
        // photo.sol: día marciano
        sol: photo.sol,
        // photo.earth_date: fecha en Tierra
        earth_date: photo.earth_date,
        // photo.img_src: URL de la imagen
        img_src: (photo.img_src as string).replace(/^http:\/\//, "https://"),
        // photo.camera y photo.rover: objetos completos con metadatos
        camera: photo.camera,
        rover: photo.rover
    }))
}

// Función que transforma la respuesta cruda de la API de NASA en un array de NasaImageEntity
export const NasaImageMap = (raw: any): NasaImageEntity[] => {
  // Se devuelve el resultado de mapear cada elemento del array raw.collection.items
  return raw.collection.items.map((item: any) => {
    // Se extrae el objeto de datos principal (sin la propiedad "preview") de la API
    const data = item.data[0] as Omit<NasaImageEntity, "preview">;
    // Tomamos la lista de enlaces asociados a esta imagen
    const links = item.links as NasaImageEntity["links"];

    // Buscamos dentro de esos enlaces uno con rel="preview" y render="image"
    // Si lo encontramos, usamos su href; si no, tomamos el href del primer enlace;
    // y si tampoco existe, usamos cadena vacía.
    const preview =
      links.find(l => l.rel === "preview" && l.render === "image")?.href // Intenta hallar enlace de vista previa
      ?? links[0]?.href // Si falla, usa el primer enlace disponible
      ?? ""; // Si no hay enlaces, fallback a cadena vacía

    // Construimos y devolvemos el objeto final conforme a NasaImageEntity:
    // - Desplegamos todas las propiedades de data
    // - Adjuntamos la lista completa de links
    // - Añadimos la URL calculada en preview
    return {
      ...data,    // Propiedades originales de la entidad (excepto preview)
      links,      // Array de enlaces tal cual vino de la API
      preview     // URL de previsualización calculada
    };
  });
};