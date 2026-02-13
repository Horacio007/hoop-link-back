import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialTrabajosCoachService } from './historial-trabajos-coach-service.service';
import { CreateHistorialTrabajosCoachServiceDto } from './dto/create-historial-trabajos-coach-service.dto';
import { UpdateHistorialTrabajosCoachServiceDto } from './dto/update-historial-trabajos-coach-service.dto';

@Controller('historial-trabajos-coach-service')
export class HistorialTrabajosCoachServiceController {
  constructor(private readonly historialTrabajosCoachServiceService: HistorialTrabajosCoachService) {}

}
