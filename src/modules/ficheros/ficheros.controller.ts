import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FicherosService } from './ficheros.service';
import { CreateFicheroDto } from './dto/create-fichero.dto';
import { UpdateFicheroDto } from './dto/update-fichero.dto';

@Controller('ficheros')
export class FicherosController {
  constructor(private readonly ficherosService: FicherosService) {}

  
}
