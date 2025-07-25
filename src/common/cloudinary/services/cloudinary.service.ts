import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as Cloudinary, UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';
import { TipoFicheroCloudinary } from '../constants/tipo-ficheros.const';

@Injectable()
export class CloudinaryService {

//#region Constructor 
    constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) { }
//#endregion

//#region Servicios
  async uploadFile(file: Express.Multer.File, ruta: string, resourceType: "image" | "video" | "raw" | "auto" = "image"): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { 
          folder: ruta ,
          resource_type: resourceType
        },
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

  async getImage(publicId: string): Promise<string> {
    return await this.cloudinary.url(publicId, );
  }

  async getVideo(publicId: string): Promise<string> {
    return await this.cloudinary.api.resource(publicId, {
      resource_type: 'video'
    });
  }

  async destroy(publicId: string, resourceType: "image" | "video" | "raw" | "auto" = "image") {
    await this.cloudinary.uploader.destroy(publicId,
      {
        resource_type: resourceType
      }
    );
  }
//#endregion
}
