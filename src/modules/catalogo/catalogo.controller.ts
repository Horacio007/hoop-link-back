import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CreateCatalogoDto } from './dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './dto/update-catalogo.dto';

@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Get('getAllTipoUsuario')
  async getAllTipoUsuario() {
    return await this.catalogoService.getAllTipoUsuario();
  }

  @Get('getAllEstado')
  async getAllEstado() {
    return await this.catalogoService.getAllEstado();
  }

  @Get('getAllMunicipioByEstado/:id')
  async getAllMunicipioByEstado(@Param('id') id: string) {
    return await this.catalogoService.getAllMunicipioByEstado(id);
  }

  @Get('getAllEstatusBusquedaJugador')
  async getAllEstatusBusquedaJugador() {
    return await this.catalogoService.getAllEstatusBusquedaJugador();
  }

}
