import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialEntrenadoresInformacionPersonalService } from './historial-entrenadores-informacion-personal.service';
import { CreateHistorialEntrenadoresInformacionPersonalDto } from './dto/create-historial-entrenadores-informacion-personal.dto';
import { UpdateHistorialEntrenadoresInformacionPersonalDto } from './dto/update-historial-entrenadores-informacion-personal.dto';

@Controller('historial-entrenadores-informacion-personal')
export class HistorialEntrenadoresInformacionPersonalController {
  constructor(private readonly historialEntrenadoresInformacionPersonalService: HistorialEntrenadoresInformacionPersonalService) {}

 
}
