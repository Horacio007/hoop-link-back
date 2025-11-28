import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { AccessTokenGuard } from '../auth/guard/auth/access-token.guard';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('list-all-jugadores')
  @UseGuards(AccessTokenGuard)
  async findAll() {
    return await this.coachService.findAll();
  }
}
