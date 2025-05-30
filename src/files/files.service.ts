import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';




@Injectable()
export class FilesService {
 
    getStaticProductImg( imageName: string){

        const path = join(__dirname, '../../static/products', imageName);

        if(!existsSync(path)){
            throw new BadRequestException(`The image ${imageName} does not exist in the server`);
        }
        return path;
    }
}
