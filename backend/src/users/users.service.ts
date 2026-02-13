import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async createByAdmin(username: string, role: UserRole) {
    // Generate random 8-char password
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

    const user = this.usersRepository.create({
      username,
      role,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Return user info AND the temporary password so Admin can share it
    return {
      ...savedUser,
      temporaryPassword,
    };
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
