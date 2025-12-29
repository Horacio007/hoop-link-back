import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VistaJugadorPerfilService } from './vista-jugador-perfil.service';
import { CreateVistaJugadorPerfilDto } from './dto/create-vista-jugador-perfil.dto';
import { UpdateVistaJugadorPerfilDto } from './dto/update-vista-jugador-perfil.dto';

@Controller('vista-jugador-perfil')
export class VistaJugadorPerfilController {
  constructor(private readonly vistaJugadorPerfilService: VistaJugadorPerfilService) {}
}
