import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from '../entities/project.entity';
import { WorkGroup } from '../entities/work-group.entity';
import { Personnel } from '../entities/personnel.entity';
import { Territory } from '../territories/entities/territory.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(WorkGroup)
        private workGroupRepository: Repository<WorkGroup>,
        @InjectRepository(Personnel)
        private personnelRepository: Repository<Personnel>,
        @InjectRepository(Territory)
        private territoryRepository: Repository<Territory>,
    ) { }

    async getAllProjects(user: User) {
        if (user.role === UserRole.ADMIN) {
            return this.projectRepository.find({
                relations: ['workGroup', 'workGroup.chief', 'workGroup.members', 'territory'],
            });
        }

        if (!user.personnel) {
            return [];
        }

        return this.projectRepository.find({
            where: [
                { workGroup: { chief: { id: user.personnel.id } } },
                { workGroup: { members: { id: user.personnel.id } } },
            ],
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members', 'territory'],
        });
    }

    async getMyProjects(user: User) {
        return this.getAllProjects(user);
    }

    async getProjectById(id: number) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members', 'workGroup.chief.user', 'workGroup.members.user', 'territory'],
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return project;
    }

    async createProject(dto: CreateProjectDto, user: User) {
        // Build the WorkGroup first
        const workGroup = this.workGroupRepository.create({
            name: `${dto.name} - WorkGroup`,
            isActive: true,
        });

        if (dto.chiefPersonnelId) {
            const chief = await this.personnelRepository.findOne({ where: { id: dto.chiefPersonnelId } });
            if (chief) workGroup.chief = chief;
        }

        if (dto.memberPersonnelIds && dto.memberPersonnelIds.length > 0) {
            const members = await this.personnelRepository.findBy({ id: In(dto.memberPersonnelIds) });
            workGroup.members = members;
        }

        const savedWg = await this.workGroupRepository.save(workGroup);

        const project = this.projectRepository.create({
            name: dto.name,
            description: dto.description,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            analysisDate: dto.analysisDate ? new Date(dto.analysisDate) : undefined,
            approvalDate: dto.approvalDate ? new Date(dto.approvalDate) : undefined,
            importanceLevel: dto.importanceLevel,
            workGroup: savedWg,
        });

        if (dto.territoryId) {
            const territory = await this.territoryRepository.findOne({ where: { id: dto.territoryId } });
            if (territory) project.territory = territory;
        }

        return this.projectRepository.save(project);
    }

    async updateProject(id: number, dto: UpdateProjectDto, user: User) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members', 'territory'],
        });

        if (!project) throw new NotFoundException('Project not found');

        // Authorization: Admin or chief of this project
        const isChief = project.workGroup?.chief?.id === user.personnel?.id;
        if (user.role !== UserRole.ADMIN && !isChief) {
            throw new ForbiddenException('Only Admins or the Project Chief can update this project');
        }

        if (dto.name) project.name = dto.name;
        if (dto.description !== undefined) project.description = dto.description;
        if (dto.startDate) project.startDate = new Date(dto.startDate);
        if (dto.endDate) project.endDate = new Date(dto.endDate);
        if (dto.importanceLevel !== undefined) project.importanceLevel = dto.importanceLevel;

        if (dto.territoryId !== undefined) {
            if (dto.territoryId === null) {
                project.territory = null as any;
            } else {
                const territory = await this.territoryRepository.findOne({ where: { id: dto.territoryId } });
                if (territory) project.territory = territory;
            }
        }

        await this.projectRepository.save(project);

        // Update WorkGroup members/chief if provided
        if (project.workGroup && (dto.chiefPersonnelId !== undefined || dto.memberPersonnelIds !== undefined)) {
            if (dto.chiefPersonnelId !== undefined) {
                if (dto.chiefPersonnelId === null) {
                    project.workGroup.chief = null as any;
                } else {
                    const chief = await this.personnelRepository.findOne({ where: { id: dto.chiefPersonnelId } });
                    if (chief) project.workGroup.chief = chief;
                }
            }

            if (dto.memberPersonnelIds !== undefined) {
                const members = await this.personnelRepository.findBy({ id: In(dto.memberPersonnelIds) });
                project.workGroup.members = members;
            }

            await this.workGroupRepository.save(project.workGroup);
        }

        return project;
    }

    async deleteProject(id: number, user: User) {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Only Admins can delete projects');
        }
        const project = await this.projectRepository.findOne({ where: { id }, relations: ['workGroup'] });
        if (!project) throw new NotFoundException('Project not found');
        if (project.workGroup) {
            await this.workGroupRepository.delete(project.workGroup.id);
        }
        return this.projectRepository.delete(id);
    }

    async getProjectUsers(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members', 'workGroup.chief.user', 'workGroup.members.user'],
        });

        if (!project || !project.workGroup) {
            throw new NotFoundException('Project or WorkGroup not found');
        }

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

        const isChief = project.workGroup.chief?.id === currentUser.personnel?.id;
        if (currentUser.role !== UserRole.ADMIN && !isChief) {
            throw new ForbiddenException('Unauthorized to modify this project');
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

        const isChief = project.workGroup.chief?.id === currentUser.personnel?.id;
        if (currentUser.role !== UserRole.ADMIN && !isChief) {
            throw new ForbiddenException('Unauthorized to modify this project');
        }

        const members = project.workGroup.members || [];
        project.workGroup.members = members.filter(m => m.id !== personnelId);

        await this.workGroupRepository.save(project.workGroup);

        return { message: 'User removed successfully' };
    }
}
