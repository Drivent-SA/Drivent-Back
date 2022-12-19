import { prisma } from "@/config";

async function findActivities() {
  return await prisma.activity.findMany({
    include: {
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

const activityRepository = {
  findActivities,
  findActivityById,
  findActivityBooking,
  createActivityBooking,
};

export default activityRepository;
