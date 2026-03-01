import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { Territory } from '../territories/entities/territory.entity';
import { WorkGroup } from './work-group.entity';
import { ProjectControl } from './project-control.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'date', nullable: true })
    analysisDate: Date;

    @Column({ type: 'date', nullable: true })
    approvalDate: Date;

    @Column({ type: 'int', nullable: true })
    importanceLevel: number;

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToOne(() => WorkGroup, wg => wg.project, { nullable: true })
    workGroup: WorkGroup;

    @ManyToOne(() => Territory, territory => territory.projects, { nullable: true })
    territory: Territory;

    @OneToMany(() => ProjectControl, pc => pc.project)
    controls: ProjectControl[];
}
