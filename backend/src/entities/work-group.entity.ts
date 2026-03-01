import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Personnel } from './personnel.entity';
import { Project } from './project.entity';

@Entity()
export class WorkGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Personnel, p => p.managedGroups, { nullable: true })
    chief: Personnel;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => Personnel, p => p.workGroups)
    @JoinTable({ name: 'integrante' })
    members: Personnel[];

    @OneToOne(() => Project, project => project.workGroup)
    @JoinColumn()
    project: Project;
}
