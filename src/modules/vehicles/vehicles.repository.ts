import { InjectRepository } from '@nestjs/typeorm';
import { VehiclesEntity } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { VehiclesFiltersDto } from './dto/vehicles-filters-dto';

export default class VehiclesRepository {
  private readonly logger = new Logger(VehiclesRepository.name);

  constructor(
    @InjectRepository(VehiclesEntity)
    private readonly vehiclesRepository: Repository<VehiclesEntity>,
  ) {}

  async getVehiclesByFilters(
    filters: VehiclesFiltersDto,
  ): Promise<VehiclesEntity[]> {
    try {
      const queryBuilder =
        this.vehiclesRepository.createQueryBuilder('vehicle');

      for (const [key, value] of Object.entries(filters)) {
        queryBuilder.andWhere(`LOWER(vehicle.${key}) LIKE LOWER(:${key})`, {
          [key]: `%${value}%`,
        });
      }

      const vehicles = await queryBuilder.getMany();

      return vehicles;
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
