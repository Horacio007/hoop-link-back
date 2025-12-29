import { PartialType } from '@nestjs/mapped-types';
import { CreateComentariosPerfilJugadorDto } from './create-comentarios-perfil-jugador.dto';

export class UpdateComentariosPerfilJugadorDto extends PartialType(CreateComentariosPerfilJugadorDto) {}
