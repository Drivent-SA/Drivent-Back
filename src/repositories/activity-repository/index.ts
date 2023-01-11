import { prisma, redis } from "@/config";
import { Activity, ActivityBooking } from "@prisma/client";

async function findActivities() {
  let activities: (Activity & {
    ActivityBooking: ActivityBooking[];
  })[] = JSON.parse(await redis.get("activities"));

  if (!activities) {
    const day = 86400;

    activities = await prisma.activity.findMany({
      include: {
        ActivityBooking: true,
      },
    });

    await redis.set("activities", JSON.stringify(activities), {
      EX: day,
    });
  }

  return activities;
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
