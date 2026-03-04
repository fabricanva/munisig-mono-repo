import { IsString, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsDateString()
    @IsOptional()
    analysisDate?: string;

    @IsDateString()
    @IsOptional()
    approvalDate?: string;

    @IsNumber()
    @IsOptional()
    importanceLevel?: number;

    @IsNumber()
    @IsOptional()
    chiefPersonnelId?: number;

    @IsArray()
    @IsOptional()
    memberPersonnelIds?: number[];

    @IsNumber()
    @IsOptional()
    territoryId?: number;
}
