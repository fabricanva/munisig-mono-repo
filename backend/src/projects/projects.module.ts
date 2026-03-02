import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../entities/project.entity';
import { WorkGroup } from '../entities/work-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, WorkGroup])],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule { }
