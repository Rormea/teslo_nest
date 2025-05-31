import { initialData } from '../../seed/data/seed-data';


export interface JwtPayload {
    //email: string;
    
    id: string;

    //TODO añadir todo lo que quieran grabar en el payload del JWT
    // Por ejemplo, podrías añadir roles, id de usuario, etc.
    // roles?: string[];
    // id?: number;
    // Puedes añadir más propiedades según tus necesidades
    // Asegúrate de que las propiedades que añadas aquí coincidan con las que esperas en tu aplicación
}