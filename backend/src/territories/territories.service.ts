import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTerritoryDto } from './dto/create-territory.dto';
import { UpdateTerritoryDto } from './dto/update-territory.dto';
import { Territory } from './entities/territory.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TerritoriesService {
  constructor(
    @InjectRepository(Territory)
    private territoriesRepository: Repository<Territory>,
  ) { }

  async create(createTerritoryDto: CreateTerritoryDto, user: User) {
    try {
      const territory = this.territoriesRepository.create({
        ...createTerritoryDto,
        createdById: user.id,
      });
      return await this.territoriesRepository.save(territory);
    } catch (e) {
      console.error('Error creating territory:', e);
      throw e;
    }
  }

  findAll() {
    return this.territoriesRepository.find();
  }

  findOne(id: number) {
    return this.territoriesRepository.findOne({ where: { id } });
  }

  update(id: number, updateTerritoryDto: UpdateTerritoryDto) {
    return this.territoriesRepository.update(id, updateTerritoryDto);
  }

  remove(id: number) {
    return this.territoriesRepository.delete(id);
  }

  async getArea(id: number) {
    // ST_Area on geography ensures result is in square meters
    const result = await this.territoriesRepository
      .createQueryBuilder('territory')
      .select('ST_Area(territory.polygon::geography) as area')
      .where('territory.id = :id', { id })
      .getRawOne();

    if (result) {
      // Update the entity with the calculated area
      await this.territoriesRepository.update(id, { calculatedArea: result.area });
    }
    return result ? parseFloat(result.area) : 0;
  }
}
