import { createParamDecorator, ExecutionContext, InternalServerErrorException} from '@nestjs/common';


export const GetUserDeco = createParamDecorator(
    ( data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest(); // Aquí puedes ver el usuario que fue inyectado por el guard de JWT
        const user = request.user; // Aquí obtienes el usuario del request, que fue inyectado por el guard de JWT
        // Si necesitas retornar un usuario específico o algún dato del usuario, puedes hacerlo aquí
        // Por ejemplo, si quieres retornar el id del usuario:
        // return user.id; // Retorna el id del usuario
        // O si quieres retornar todo el objeto del usuario:
        // return user; // Retorna todo el objeto del usuario
        // Si necesitas retornar un dato específico del usuario, puedes hacerlo así:
        // return user.email; // Retorna el email del usuario
       //const result = !user.email?user:user
       const result = (!data) ? user : user[data]; // Si no se pasa un dato específico, retorna el usuario completo, si se pasa un dato, retorna ese dato del usuario
        // Si el usuario no existe, lanza una excepción
      if (!user) { throw new InternalServerErrorException('User not found in request'); }

        return result; // Aquí puedes retornar el usuario o cualquier dato que necesites
    }
);

export const GetRawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.rawHeaders;

        if (!headers) { throw new InternalServerErrorException('Headers not found in request'); }
         // Si no se pasa un dato específico, retorna todos los headers, si se pasa un dato, retorna ese header específico
            
        return headers; // Retorna los headers crudos
    }
);