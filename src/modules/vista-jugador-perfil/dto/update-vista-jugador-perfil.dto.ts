import { PartialType } from '@nestjs/mapped-types';
import { CreateVistaJugadorPerfilDto } from './create-vista-jugador-perfil.dto';

export class UpdateVistaJugadorPerfilDto extends PartialType(CreateVistaJugadorPerfilDto) {}
