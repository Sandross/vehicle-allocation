import { Injectable, Logger } from '@nestjs/common';
import { CreateNewVehicleDto } from './dto/create-new-vehicle-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiclesEntity } from 'src/app/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { UpdateVehicleDto } from './dto/update-vehicle-dto';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  constructor(
    @InjectRepository(VehiclesEntity)
    private readonly vehiclesRepository: Repository<VehiclesEntity>,
  ) {}

  async createNewVehicle(
    vehicle: CreateNewVehicleDto,
  ): Promise<CreateNewVehicleDto> {
    try {
      const vehicleAlreadyExists = await this.vehiclesRepository.findOne({
        where: { brand: vehicle.brand },
      });
      if (vehicleAlreadyExists) {
        this.logger.error('Vehicle already exists');
        throw new Error('Vehicle already exists');
      }
      return this.vehiclesRepository.save(vehicle);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async updateVehicle(
    id: number,
    vehicle: UpdateVehicleDto,
  ): Promise<UpdateVehicleDto> {
    try {
      const vehicleToUpdate = await this.vehiclesRepository.findOne({
        where: { id },
      });
      if (!vehicleToUpdate) throw new Error('Vehicle not found');
      await this.vehiclesRepository.update(id, vehicle);
      return await this.vehiclesRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async deleteVehicle(id: number): Promise<string> {
    try {
      const vehicleToDelete = await this.vehiclesRepository.findOne({
        where: { id },
      });
      if (!vehicleToDelete) throw new Error('Vehicle not found');
      await this.vehiclesRepository.delete(id);
      return `Vehicle with id ${id} deleted successfully`;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async getVehicleById(id: number): Promise<VehiclesEntity> {
    try {
      const vehicle = await this.vehiclesRepository.findOne({
        where: { id },
      });
      if (!vehicle) throw new Error('Vehicle not found');
      return vehicle;
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
