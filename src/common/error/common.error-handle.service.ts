import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ErrorHandleDB } from '../interfaces/errors/error-handler.interface';
import { TypeError } from '../enums/errors/common.error-handle.enum';

@Injectable()
export class ErrorHandleService {
    private readonly logger = new Logger('ErrorHandleService');

    public errorTypes 

    public errorHandleDB(error: ErrorHandleDB):never {
        switch (+error.code) {
            case 23505:
                throw new BadRequestException(`${error.severity} => ${error.detail}`);
                break;
            case 22001:
                throw new BadRequestException(`${error.severity} => ${error.detail}`);
                break;
            default:
                console.log(error);
                this.logger.error(error);
                throw new InternalServerErrorException('Unexpected Error');
                break;
        }
        
    }

    public errorHandle(message: string, method:TypeError):never {
        switch (method) {
            case TypeError.NotFoundException:
                throw new NotFoundException(`${message}`);
                break;
            case TypeError.Error:
                throw new Error(`${message}`);
                break;
            case TypeError.BadRequestException:
                throw new BadRequestException(`${message}`);
                break;
            case TypeError.UnauthorizedException:
                throw new UnauthorizedException(`${message}`);
                break;
        
            default:
                throw new InternalServerErrorException('Unexpected Error');
                break;
        }
        
    }
}
