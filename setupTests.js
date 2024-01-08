const { seedDynamo, clearDynamo } = require("./src/seed/seedDynamo");
const seedData = require("./src/seed/data");

beforeEach(async () => {
  await seedDynamo(seedData);
});

afterEach(async () => {
  await clearDynamo(seedData);
});
