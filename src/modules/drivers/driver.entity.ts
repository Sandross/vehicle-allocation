import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { VehiclesAllocationEntity } from '../vehicles-allocation/vehicle-allocation.entity';

@Entity('drivers')
export class DriverEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  name: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @OneToMany(
    () => VehiclesAllocationEntity,
    (usageRecord) => usageRecord.driver,
  )
  usageRecords: VehiclesAllocationEntity[];
}
