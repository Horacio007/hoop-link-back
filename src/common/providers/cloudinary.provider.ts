// import { v2 as cloudinary } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';

// export const CloudinaryProvider = {
//   provide: 'CLOUDINARY',
//   useFactory: (configService: ConfigService) => {
//     // Configurar Cloudinary usando variables de entorno
//     cloudinary.config({
//       cloud_name: configService.get<string>('big-duck-tech'),
//       api_key: configService.get<string>('api_key'),
//       api_secret: configService.get<string>('api_secret'),
//     });

//     return cloudinary;
//   },
//   inject: [ConfigService],
// };