import { prisma } from "@/config";

async function findActivities(eventId: number) {
  return await prisma.activity.findMany({
    where: {
      eventId,
    },
    include: {
      Place: true,
    },
  });
}

async function findPlaceById(id: number) {
  return await prisma.place.findFirst({
    where: {
      id,
    },
  });
}

const activityRepository = {
  findActivities,
  findPlaceById,
};

export default activityRepository;
