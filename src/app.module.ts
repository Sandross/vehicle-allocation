import { Module } from '@nestjs/common';
import { DriverModule } from './modules/drivers/drivers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { VehiclesAllocationModule } from './modules/vehicles-allocation/vehicles-allocation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DriverModule,
    VehiclesModule,
    VehiclesAllocationModule,
  ],
})
export class AppModule {}
