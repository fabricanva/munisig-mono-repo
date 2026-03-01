import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Raster } from './raster.entity';

@Entity()
export class Cell {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    information: string;

    @ManyToOne(() => Raster, raster => raster.cells)
    raster: Raster;
}
