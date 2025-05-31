import { createParamDecorator, ExecutionContext, InternalServerErrorException} from '@nestjs/common';


export const GetRawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.rawHeaders;

        if (!headers) { throw new InternalServerErrorException('Headers not found in request'); }
         // Si no se pasa un dato específico, retorna todos los headers, si se pasa un dato, retorna ese header específico
            
        return headers; // Retorna los headers crudos
    }
);