import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialEquiposInformacionPersonalService } from './historial-equipos-informacion-personal.service';
import { CreateHistorialEventosInformacionPersonalDto } from './dto/create-historial-eventos-informacion-personal.dto';
import { UpdateHistorialEventosInformacionPersonalDto } from './dto/update-historial-eventos-informacion-personal.dto';

@Controller('historial-eventos-informacion-personal')
export class HistorialEventosInformacionPersonalController {
  constructor(private readonly historialEquiposInformacionPersonalService: HistorialEquiposInformacionPersonalService) {}

  
}
