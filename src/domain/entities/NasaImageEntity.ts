/* INTERFAZ PARA LAS IMÁGENES DE LA NASA 
 * NOTA: EL FETCH TRAE METADATOS Y LOS LINKS DE LAS IMÁGENES
 * ES POR ELLO QUE NO SE CONSIDERAN TODOS LOS DATOS DEL FETCH
 * SINO ÚNICAMENTE LOS REALMENTE RELEVANTES PARA PODER MOSTRAR LAS IMÁGENES EN LA APLICACIÓN.
 * 
*/
export interface NasaImageEntity {
    // Estos son los valores de data
    center: string;
    date_created: string;
    description: string;
    description_508?: string;
    keywords: string[];
    media_type: 'image' | 'video';
    nasa_id: string;
    secondary_creator?: string; // Puede haber como no
    title: string;

    // Estos son los links[] (ARREGLO DE OBJETOS)
    links: {
        href: string;
        rel: string;
        render: string;
        width?: number;
        height?: number;
        size?: number;
        // Son valores que puede tener o no
    }[];

    preview: string;
}