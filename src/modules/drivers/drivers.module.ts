import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './driver.entity';
import { DriverService } from './drivers.service';
import { Module } from '@nestjs/common';
import { DriverController } from './drivers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {}
