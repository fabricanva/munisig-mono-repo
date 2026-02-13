import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { TerritoriesService } from './territories.service';
import { CreateTerritoryDto } from './dto/create-territory.dto';
import { UpdateTerritoryDto } from './dto/update-territory.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '../users/entities/user.entity';

@Controller('territories')
export class TerritoriesController {
  constructor(private readonly territoriesService: TerritoriesService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @Post()
  create(@Body() createTerritoryDto: CreateTerritoryDto, @Request() req: ExpressRequest & { user: User }) {
    return this.territoriesService.create(createTerritoryDto, req.user);
  }

  @Get()
  findAll() {
    return this.territoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.territoriesService.findOne(+id);
  }

  @Get(':id/area')
  getArea(@Param('id') id: string) {
    return this.territoriesService.getArea(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.WORKER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTerritoryDto: UpdateTerritoryDto) {
    return this.territoriesService.update(+id, updateTerritoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.territoriesService.remove(+id);
  }
}
