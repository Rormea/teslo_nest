import { Post,Get, Controller, UploadedFile, UseInterceptors, BadRequestException, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { upfileRules } from './helpers/upfile_rules';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file_namer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) 
    {}


  @Get('product/:imageName')
  findProductImmgParam(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const imagePath = this.filesService.getStaticProductImg(imageName);
   // Si usamos rest de exprres le decimos  que ahora yo voy tomar el control manal de la respuesta return imagePath
    res.sendFile(imagePath);
  }

  ///////////////////

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: upfileRules,
    storage: diskStorage({
      destination:'./static/products',
      filename: fileNamer
    })
  }))
  upLoadFiles( 
    @UploadedFile() file: Express.Multer.File,
    // este file es el archivo en si que se sube a un carpeta tempral
    // lo ideal es no guardarlo en nuestro filesystem, sino en un servicio de almacenamiento como S3, Cloudinary, etc.
  ) {

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    //console.log(file)
    const secureUrl = ` ${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {secureUrl}
  }
}
