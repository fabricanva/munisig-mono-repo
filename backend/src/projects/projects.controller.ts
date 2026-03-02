import { Controller, Get, Post, Delete, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Get('my-projects')
    getMyProjects(@Request() req: any) {
        return this.projectsService.getMyProjects(req.user);
    }

    @Get(':id/users')
    getProjectUsers(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.getProjectUsers(id);
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
