import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../entities/project.entity';
import { Raster } from '../../entities/raster.entity';
import { Layer } from '../../entities/layer.entity';

@Entity()
export class Territory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Polygon',
        srid: 4326, // WGS 84
    })
    polygon: object;

    @Column('float', { nullable: true })
    calculatedArea: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @Column({ nullable: true })
    createdById: number;

    @OneToMany(() => Project, project => project.territory)
    projects: Project[];

    @OneToMany(() => Raster, raster => raster.territory)
    rasters: Raster[];

    @ManyToOne(() => Layer, layer => layer.features, { nullable: true })
    layer: Layer;
}
