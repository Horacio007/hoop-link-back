import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogrosClaveInformacionPersonalService } from './logros-clave-informacion-personal.service';
import { CreateLogrosClaveInformacionPersonalDto } from './dto/create-logros-clave-informacion-personal.dto';
import { UpdateLogrosClaveInformacionPersonalDto } from './dto/update-logros-clave-informacion-personal.dto';

@Controller('logros-clave-informacion-personal')
export class LogrosClaveInformacionPersonalController {
  constructor(private readonly logrosClaveInformacionPersonalService: LogrosClaveInformacionPersonalService) {}

 
}
