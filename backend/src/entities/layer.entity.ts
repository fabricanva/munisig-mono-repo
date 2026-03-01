import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Territory } from '../territories/entities/territory.entity';

@Entity()
export class Layer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // e.g., 'Parques', 'Rios', 'Zonas de Riesgo'

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    color: string; // Default color for rendering

    @Column({ default: true })
    isVisible: boolean; // Toggle visibility in frontend

    @OneToMany(() => Territory, territory => territory.layer)
    features: Territory[];
}
