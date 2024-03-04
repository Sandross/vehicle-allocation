import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VehiclesAllocationEntity } from './vehicle-allocation.entity';

@Entity('vehicles')
export class VehiclesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  license_plate: string;

  @Column('text', { nullable: false })
  color: string;

  @Column('text', { nullable: false })
  brand: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @OneToMany(
    () => VehiclesAllocationEntity,
    (usageRecord) => usageRecord.vehicle,
  )
  usageRecords: VehiclesAllocationEntity[];
}
