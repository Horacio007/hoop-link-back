import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { RoutesPathsClodudinary } from '../constants/route-paths.const';

@Injectable()
export class CloudinaryService {

//#region Constructor 
    constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) { }
//#endregion

//#region Servicios
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
          const uploadStream = this.cloudinary.uploader.upload_stream(
            { folder: RoutesPathsClodudinary.IMAGEN_PERFIL },
            (error, result) => {
              if (error) return reject(error);
              return resolve(result);
            }
          );
    
          Readable.from(file.buffer).pipe(uploadStream);
        });
      }

    async listFolder(folderPath: string): Promise<any> {
        console.log('entre');
        return await this.cloudinary.api.resources_by_asset_folder('hoop-link/imagen-perfil').then();
    }
//#endregion
}
