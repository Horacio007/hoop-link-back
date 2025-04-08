import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [CatalogoController],
  providers: [CatalogoService],
  imports: [
    CommonModule
  ]
})
export class CatalogoModule {}
