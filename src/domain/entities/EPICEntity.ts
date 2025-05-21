/* ENTIDAD QUE REPRESENTA A LOS DATOS DEL FETCH DE LA CÁMARA QUE TOMA FOTOS A LA TIERRA */
export interface EPICEntity {
    identifier: string;
    caption: string;
    image: string;
    version: string;
    date: string;
    centroid_coordinates: {
      lat: number;
      lon: number;
    };
    dscovr_j2000_position: { x: number; y: number; z: number };
    lunar_j2000_position: { x: number; y: number; z: number };
    sun_j2000_position: { x: number; y: number; z: number };
    attitude_quaternions: { q0: number; q1: number; q2: number; q3: number };
}