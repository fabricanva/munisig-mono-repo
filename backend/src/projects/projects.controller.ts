import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Get()
    getAllProjects(@Request() req: any) {
        return this.projectsService.getAllProjects(req.user);
    }

    @Get('my-projects')
    getMyProjects(@Request() req: any) {
        return this.projectsService.getMyProjects(req.user);
    }

    @Get(':id')
    getProjectById(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.getProjectById(id);
    }

    @Get(':id/users')
    getProjectUsers(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.getProjectUsers(id);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    createProject(@Body() dto: CreateProjectDto, @Request() req: any) {
        return this.projectsService.createProject(dto, req.user);
    }

    @Patch(':id')
    updateProject(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProjectDto,
        @Request() req: any,
    ) {
        return this.projectsService.updateProject(id, dto, req.user);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    deleteProject(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.projectsService.deleteProject(id, req.user);
    }

    @Post(':id/users/:personnelId')
    addProjectUser(
        @Param('id', ParseIntPipe) id: number,
        @Param('personnelId', ParseIntPipe) personnelId: number,
        @Request() req: any
    ) {
        return this.projectsService.addProjectUser(id, personnelId, req.user);
    }

    @Delete(':id/users/:personnelId')
    removeProjectUser(
        @Param('id', ParseIntPipe) id: number,
        @Param('personnelId', ParseIntPipe) personnelId: number,
        @Request() req: any
    ) {
        return this.projectsService.removeProjectUser(id, personnelId, req.user);
    }
}
