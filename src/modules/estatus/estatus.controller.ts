import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstatusService } from './estatus.service';
import { CreateEstatusDto } from './dto/create-estatus.dto';
import { UpdateEstatusDto } from './dto/update-estatus.dto';

@Controller('estatus')
export class EstatusController {
  
  constructor(private readonly estatusService: EstatusService) {}

}
