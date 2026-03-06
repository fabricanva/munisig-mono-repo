import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserByAdminDto } from './dto/create-user-admin.dto';
import { UpdateUserByAdminDto } from './dto/update-user-admin.dto';
import { User, UserRole } from './entities/user.entity';
import { Personnel } from '../entities/personnel.entity';
import { WorkGroup } from '../entities/work-group.entity';
import { Project } from '../entities/project.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
    @InjectRepository(WorkGroup)
    private workGroupRepository: Repository<WorkGroup>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // For simplicity, we'll take password from dto. In real app add validation etc.
    const salt = await bcrypt.genSalt();
    // @ts-ignore
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  findAll() {
    return this.usersRepository.find({
      relations: ['personnel', 'personnel.workGroups', 'personnel.managedGroups'],
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['personnel']
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async createByAdmin(dto: CreateUserByAdminDto) {
    // Generate random 8-char password
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

    const user = this.usersRepository.create({
      username: dto.username,
      role: dto.role,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create Personnel link
    const personnel = this.personnelRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      user: savedUser,
    });
    const savedPersonnel = await this.personnelRepository.save(personnel);

    savedUser.personnel = savedPersonnel;
    await this.usersRepository.save(savedUser);

    // Assign to project if provided
    if (dto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: dto.projectId },
        relations: ['workGroup', 'workGroup.chief', 'workGroup.members'],
      });

      if (project && project.workGroup) {
        if (dto.isChief) {
          project.workGroup.chief = savedPersonnel;
        } else {
          const members = project.workGroup.members || [];
          members.push(savedPersonnel);
          project.workGroup.members = members;
        }
        await this.workGroupRepository.save(project.workGroup);
      }
    }

    // Return user info AND the temporary password so Admin can share it
    return {
      ...savedUser,
      personnel: savedPersonnel,
      temporaryPassword,
    };
  }

  async updateByAdmin(id: number, dto: UpdateUserByAdminDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['personnel'],
    });

    if (!user) throw new Error('User not found');

    if (dto.username) user.username = dto.username;
    if (dto.role) user.role = dto.role;

    await this.usersRepository.save(user);

    if (user.personnel) {
      if (dto.firstName) user.personnel.firstName = dto.firstName;
      if (dto.lastName) user.personnel.lastName = dto.lastName;
      if (dto.email !== undefined) user.personnel.email = dto.email;
      await this.personnelRepository.save(user.personnel);

      if (dto.projectId !== undefined) {
        // First remove them from their old projects since they are being reassigned
        const oldProjects = await this.projectRepository.find({
          relations: ['workGroup', 'workGroup.chief', 'workGroup.members'],
        });

        for (const proj of oldProjects) {
          if (proj.workGroup) {
            let changed = false;
            // Remove from chief
            if (proj.workGroup.chief?.id === user.personnel.id) {
              proj.workGroup.chief = null as any;
              changed = true;
            }
            // Remove from members
            if (proj.workGroup.members?.some((m) => m.id === user.personnel.id)) {
              proj.workGroup.members = proj.workGroup.members.filter((m) => m.id !== user.personnel.id);
              changed = true;
            }
            if (changed) {
              await this.workGroupRepository.save(proj.workGroup);
            }
          }
        }

        // Add to new project if passed
        if (dto.projectId !== null) {
          const newProject = await this.projectRepository.findOne({
            where: { id: dto.projectId },
            relations: ['workGroup', 'workGroup.chief', 'workGroup.members'],
          });

          if (newProject && newProject.workGroup) {
            if (dto.isChief) {
              newProject.workGroup.chief = user.personnel;
            } else {
              const members = newProject.workGroup.members || [];
              members.push(user.personnel);
              newProject.workGroup.members = members;
            }
            await this.workGroupRepository.save(newProject.workGroup);
          }
        }
      }
    }

    return user;
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
