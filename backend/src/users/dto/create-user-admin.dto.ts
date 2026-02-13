import { IsEnum, IsString, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserByAdminDto {
    @IsString()
    username: string;

    @IsEnum(UserRole)
    role: UserRole;
}
