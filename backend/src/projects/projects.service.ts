import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { WorkGroup } from '../entities/work-group.entity';
import { Personnel } from '../entities/personnel.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(WorkGroup)
        private workGroupRepository: Repository<WorkGroup>,
    ) { }

    async getMyProjects(user: User) {
        if (user.role === UserRole.ADMIN) {
            return this.projectRepository.find({
                relations: ['workGroup'],
            });
        }

        if (!user.personnel) {
            return [];
        }

        // A project manager or worker sees projects they are part of
        return this.projectRepository.find({
            where: [
                { workGroup: { chief: { id: user.personnel.id } } },
                { workGroup: { members: { id: user.personnel.id } } },
            ],
            relations: ['workGroup'],
        });
    }

    async getProjectUsers(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members', 'workGroup.chief.user', 'workGroup.members.user'],
        });

        if (!project || !project.workGroup) {
            throw new NotFoundException('Project or WorkGroup not found');
        }

        // Return combined users/personnel to easily map them in the frontend
        const users = [];
        if (project.workGroup.chief) {
            users.push({ ...project.workGroup.chief, isChief: true });
        }

        if (project.workGroup.members) {
            project.workGroup.members.forEach((member) => {
                users.push({ ...member, isChief: false });
            });
        }

        return users;
    }

    async addProjectUser(projectId: number, personnelId: number, currentUser: User) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members'],
        });

        if (!project || !project.workGroup) {
            throw new NotFoundException('Project or WorkGroup not found');
        }

        // Auth check
        const isChief = project.workGroup.chief?.id === currentUser.personnel?.id;
        if (currentUser.role !== UserRole.ADMIN && !isChief) {
            throw new Error('Unauthorized to modify this project');
        }

        const members = project.workGroup.members || [];
        const isAlreadyMember = members.some(m => m.id === personnelId);

        if (!isAlreadyMember) {
            members.push({ id: personnelId } as Personnel);
            project.workGroup.members = members;
            await this.workGroupRepository.save(project.workGroup);
        }

        return { message: 'User added successfully' };
    }

    async removeProjectUser(projectId: number, personnelId: number, currentUser: User) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members'],
        });

        if (!project || !project.workGroup) {
            throw new NotFoundException('Project or WorkGroup not found');
        }

        // Auth check
        const isChief = project.workGroup.chief?.id === currentUser.personnel?.id;
        if (currentUser.role !== UserRole.ADMIN && !isChief) {
            throw new Error('Unauthorized to modify this project');
        }

        const members = project.workGroup.members || [];
        project.workGroup.members = members.filter(m => m.id !== personnelId);

        await this.workGroupRepository.save(project.workGroup);

        return { message: 'User removed successfully' };
    }
}
