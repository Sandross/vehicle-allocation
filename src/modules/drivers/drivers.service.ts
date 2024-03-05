import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DriverEntity } from './driver.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver-dto';
import { VehiclesAllocationEntity } from '../vehicles-allocation/vehicle-allocation.entity';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>,
    @InjectRepository(VehiclesAllocationEntity)
    private readonly vehiclesAllocationEntity: Repository<VehiclesAllocationEntity>,
  ) {}

  async createNewDriver(driver: CreateDriverDto): Promise<CreateDriverDto> {
    try {
      const driverAlreadyExists = await this.driverRepository.findOne({
        where: { name: driver.name },
      });

      if (driverAlreadyExists) {
        this.logger.error(`Driver widh name ${driver.name} already exists`);
        throw new BadRequestException(
          `Driver widh name ${driver.name} already exists`,
        );
      }

      return this.driverRepository.save(driver);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDriver(id: number, driver: CreateDriverDto): Promise<any> {
    try {
      const searchedDriver = await this.driverRepository.findOne({
        where: { id },
      });

      if (!searchedDriver) {
        throw new NotFoundException(`Driver widh id ${id} not found`);
      }

      await this.driverRepository.update(id, driver);
      return await this.driverRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDriver(id: number): Promise<any> {
    try {
      const searchedDriver = await this.driverRepository.findOne({
        where: { id },
      });

      if (!searchedDriver) {
        throw new NotFoundException(`Driver with id ${id} not found`);
      }
      const driverUnderContract = await this.vehiclesAllocationEntity.findOne({
        where: { driver: { id }, endDate: null },
        relations: ['vehicle', 'driver'],
      });
      if (driverUnderContract) {
        throw new BadRequestException(
          `Driver with id ${id} is currently under contract, cannot delete it`,
        );
      }
      await this.driverRepository.softDelete(id);
      this.logger.log(`Driver with id ${id} deleted successfully`);
      return `Driver with id ${id} deleted successfully`;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllDrivers(name: string): Promise<DriverEntity[]> {
    try {
      if (name) {
        const request = await this.driverRepository.find({
          where: { name: ILike(`%${name.toLowerCase()}%`) },
          relations: ['usageRecords'],
        });

        if (!request) {
          throw new NotFoundException(`No with name ${name} driver found`);
        }
      }

      const request = await this.driverRepository.find({
        relations: ['usageRecords'],
      });

      if (!request) {
        throw new NotFoundException('We have no drivers in the database');
      }

      return request;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findDriverById(id: number): Promise<DriverEntity> {
    try {
      const request = await this.driverRepository.findOne({ where: { id } });

      if (!request) {
        throw new NotFoundException(`Driver with id ${id} not found`);
      }

      return request;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
