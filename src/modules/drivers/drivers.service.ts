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

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>,
  ) {}

  async createNewDriver(
    driver: CreateDriverDto,
  ): Promise<CreateDriverDto | { error: string }> {
    try {
      const driverAlreadyExists = await this.driverRepository.findOne({
        where: { name: driver.name },
      });
      if (driverAlreadyExists) {
        this.logger.error('Driver already exists');
        throw new BadRequestException('Driver already exists');
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
      const searchedDriver = this.driverRepository.findOne({ where: { id } });
      if (!searchedDriver) throw new NotFoundException('Driver not found');
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
      const searchedDriver = this.driverRepository.findOne({ where: { id } });
      if (!searchedDriver) throw new NotFoundException('Driver not found');
      await this.driverRepository.softDelete(id);
      return await this.driverRepository.findOne({ where: { id } });
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
          throw new NotFoundException('No driver found');
        }
      }
      const request = await this.driverRepository.find({
        relations: ['usageRecords'],
      });
      if (!request) {
        throw new NotFoundException('No driver found');
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
        throw new NotFoundException('Driver not found');
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
