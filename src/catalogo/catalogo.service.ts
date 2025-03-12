import { Injectable } from '@nestjs/common';
import { CreateCatalogoDto } from './dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './dto/update-catalogo.dto';

@Injectable()
export class CatalogoService {
  create(createCatalogoDto: CreateCatalogoDto) {
    return 'This action adds a new catalogo';
  }

  findAll() {
    return `This action returns all catalogo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogo`;
  }

  update(id: number, updateCatalogoDto: UpdateCatalogoDto) {
    return `This action updates a #${id} catalogo`;
  }

  remove(id: number) {
    return `This action removes a #${id} catalogo`;
  }
}
