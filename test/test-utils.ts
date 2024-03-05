export const mockedDriversService = {
  findAllDrivers: jest.fn(),
  findDriverById: jest.fn(),
  createNewDriver: jest.fn(),
  updateDriver: jest.fn(),
  deleteDriver: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  find: jest.fn(),
};

export const mockedVehicleAllocationService = {
  createNewVehicleAllocation: jest.fn(),
  updateVehicleAllocation: jest.fn(),
  deleteVehicleAllocation: jest.fn(),
  getVehicleAllocationById: jest.fn(),
  getVehiclesAllocations: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

export const mockedVehiclesService = {
  createNewVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
  getVehicleById: jest.fn(),
  getVehicles: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
};

export const mockedVehiclesRepository = {
  getVehiclesByFilters: jest.fn(),
  findOne: jest.fn(),
};
