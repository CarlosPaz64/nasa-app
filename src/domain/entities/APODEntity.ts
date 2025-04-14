/* ENTIDAD PRINCIPAL PARA LA RUTA DE LA FOTOGRAFÍA ASTRONÓMICA DEL DÍA */
export interface APODEntity {
    date: string; 
    explanation: string;
    hdurl: string;
    media_type: string;
    service_version: string;
    title: string;
    url: string;
}
/* BÁSICAMENTE SON LOS DATOS QUE TRAE EL FETCH A LA RUTA DEL APOD */