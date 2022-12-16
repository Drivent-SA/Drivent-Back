import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createPlace() {
  return await prisma.place.create({
    data: {
      name: faker.address.cityName(),
    },
  });
}
