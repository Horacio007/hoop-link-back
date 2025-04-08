import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ErrorHandleDB } from '../interfaces/errors/error-handler.interface';
import { ErrorMethods } from '../enums/errors/common.error-handle.enum';

@Injectable()
export class ErrorHandleService {
    private readonly logger = new Logger('ErrorHandleService');

    private errorHandleDB(error: ErrorHandleDB):never {
        switch (error.errno) {
            case 1062:
                throw new BadRequestException(`${error.code} => ${error.sqlMessage}`);
                break;
            default:
                console.log(error);
                this.logger.error(error);
                throw new InternalServerErrorException('Error inesperado, favor de contactar a soporte.');
                break;
        }
        
    }

    public errorHandle(message: string | ErrorHandleDB, method:ErrorMethods):never {
        
        if (this.esErrorHandleDB(message)) this.errorHandleDB(message);

        switch (method) {
            case ErrorMethods.NotFoundException:
                throw new NotFoundException(`${message}`);
                break;
            case ErrorMethods.Error:
                throw new Error(`${message}`);
                break;
            case ErrorMethods.BadRequestException:
                throw new BadRequestException(`${message}`);
                break;
            case ErrorMethods.UnauthorizedException:
                throw new UnauthorizedException(`${message}`);
                break;
        
            default:
                console.log(message);
                this.logger.error(message);
                throw new InternalServerErrorException('Error inesperado, favor de contactar a soporte.');
                break;
        }
        
    }

    private esErrorHandleDB(obj: any): obj is ErrorHandleDB {
        return (
          typeof obj === "object" &&
          obj !== null &&
          "query" in obj &&
          "parameters" in obj &&
          "driverError" in obj &&
          "code" in obj &&
          "errno" in obj &&
          "sqlState" in obj &&
          "sqlMessage" in obj &&
          "sql" in obj &&
          typeof obj.query === "string" &&
          Array.isArray(obj.parameters) &&
          typeof obj.code === "string" &&
          typeof obj.errno === "number" &&
          typeof obj.sqlState === "string" &&
          typeof obj.sqlMessage === "string" &&
          typeof obj.sql === "string"
        );
      }

    public setError(message:string) {
        throw new Error(message);
    }
}
