import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Territory } from '../territories/entities/territory.entity';
import { Cell } from './cell.entity';

@Entity()
export class Raster {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bytea', nullable: true })
    rasterTotal: Buffer;

    @Column({ nullable: true })
    width: string;

    @ManyToOne(() => Territory, territory => territory.rasters, { nullable: true })
    territory: Territory;

    @OneToMany(() => Cell, cell => cell.raster)
    cells: Cell[];
}
