import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Personnel } from './personnel.entity';

@Entity()
export class Profession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Personnel, personnel => personnel.profession)
    personnel: Personnel[];
}
