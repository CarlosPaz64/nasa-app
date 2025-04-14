/* INTERFAZ QUE SIMILAR A LA DE NASA IMAGE
 * SE 'CORTA' PARA OBTENER SOLO LOS DATOS RELEVANTES 
 * PARA MOSTRAR AL USUARIO
 * YA QUE TIENE MUCHAS COSAS COMO TAL
*/

export interface AsteroidEntity {
    name: string;
    close_approach_date: string;
    velocity_kph: string;
    miss_distance_km: string;
    is_potentially_hazardous_asteroid: boolean;
}