import { IsEnum, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserByAdminDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsNumber()
    @IsOptional()
    projectId?: number;

    @IsBoolean()
    @IsOptional()
    isChief?: boolean;
}
