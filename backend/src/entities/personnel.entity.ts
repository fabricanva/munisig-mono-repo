import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany, OneToMany } from 'typeorm';
import { Profession } from './profession.entity';
import { User } from '../users/entities/user.entity';
import { WorkGroup } from './work-group.entity';
import { ProjectControl } from './project-control.entity';

@Entity()
export class Personnel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    maternalName: string;

    @Column({ nullable: true })
    ci: string;

    @Column({ nullable: true })
    functionRole: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ default: true })
    isAvailable: boolean;

    @ManyToOne(() => Profession, prof => prof.personnel)
    profession: Profession;

    @OneToOne(() => User, user => user.personnel)
    user: User;

    @ManyToMany(() => WorkGroup, wg => wg.members)
    workGroups: WorkGroup[];

    @OneToMany(() => WorkGroup, wg => wg.chief)
    managedGroups: WorkGroup[];

    @OneToMany(() => ProjectControl, pc => pc.personnel)
    controls: ProjectControl[];

    @OneToMany(() => ProjectControl, pc => pc.chief)
    managedControls: ProjectControl[];
}
