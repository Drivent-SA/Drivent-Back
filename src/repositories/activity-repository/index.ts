import { prisma } from "@/config";

async function findActivities(eventId: number) {
  return await prisma.activity.findMany({
    where: {
      eventId,
    },
    include: {
      Place: true,
      ActivityBooking: true,
    },
  });
}

async function findActivityById(id: number) {
  return await prisma.activity.findFirst({
    where: {
      id,
    },
  });
}

async function findActivityBooking(activityId: number) {
  return await prisma.activityBooking.findMany({
    where: {
      activityId,
    },
  });
}

async function createActivityBooking(activityId: number, userId: number) {
  return await prisma.activityBooking.create({
    data: {
      activityId,
      userId,
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
  findActivityById,
  findActivityBooking,
  createActivityBooking,
  findPlaceById,
};

export default activityRepository;
