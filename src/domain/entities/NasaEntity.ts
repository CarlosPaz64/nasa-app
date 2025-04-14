/* INTERFAZ BASE PARA LA INFORMACIÓN DE LA NASA */
export interface NasaEntity<T> {
    id?: string;
    // El id es para representar cada 'fetch'
    data: T[];
    /* *
    * Eso de la 'T' es un tipo genérico. Se le está diciendo a TypeScript
    * no sé qué tipo es pero se sabrá cuando se use    
    */
}
/* ESTA INTERFAZ NOS PERMITIRÁ EXPANDIR LA MISMA CONSIDERANDO EL FETCH DE CADA RUTA */