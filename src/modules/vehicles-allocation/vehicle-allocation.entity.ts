import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DriverEntity } from '../drivers/driver.entity';
import { VehiclesEntity } from '../vehicles/vehicle.entity';

@Entity('vehicle_allocation')
export class VehiclesAllocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @ManyToOne(() => DriverEntity, (driver) => driver.usageRecords)
  @JoinColumn({ name: 'driverId' })
  driver: DriverEntity;

  @ManyToOne(
    () => VehiclesEntity,
    (vehiclesEntity) => vehiclesEntity.usageRecords,
  )
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehiclesEntity;
}
