/* ENTIDAD PARA LAS FOTOS DE MARTE */
export interface MarsRoverPhotosEntity {
    id: number;
    sol: number;
    earth_date: string;
    img_src: string;
    camera: {
      id: number;
      name: string;
      rover_id: number;
      full_name: string;
    };
    rover: {
      id: number;
      name: string;
      landing_date: string;
      launch_date: string;
      status: string;
    };
}