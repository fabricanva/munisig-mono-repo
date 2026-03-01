import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { Personnel } from './personnel.entity';

@Entity()
export class ProjectControl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    percentage: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    observations: string;

    @Column({ type: 'date', nullable: true })
    controlDate: Date;

    @ManyToOne(() => Personnel, p => p.controls, { nullable: true })
    personnel: Personnel;

    @ManyToOne(() => Personnel, p => p.managedControls, { nullable: true })
    chief: Personnel;

    @ManyToOne(() => Project, p => p.controls)
    project: Project;
}
