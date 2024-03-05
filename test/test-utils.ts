export const mockedDriversService = {
  findAllDrivers: jest.fn(),
  findDriverById: jest.fn(),
  createNewDriver: jest.fn(),
  updateDriver: jest.fn(),
  deleteDriver: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
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
