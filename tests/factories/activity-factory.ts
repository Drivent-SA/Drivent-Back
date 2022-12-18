import { prisma } from "@/config";
import set from "date-fns/set";
import faker from "@faker-js/faker";
import { createEvent } from "./events-factory";
import { createPlace } from "./place-factory";
import { createUser } from "./users-factory";
import dayjs from "dayjs";

export async function createActivity(eventId?: number, placeId?: number) {
  const incomingEvent = eventId || (await createEvent()).id;
  const incomingPlace = placeId || (await createPlace()).id;
  return prisma.activity.create({
    data: {
      title: faker.commerce.productName(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      placeId: incomingPlace,
      eventId: incomingEvent,
      date: dayjs("2022-02-18").toISOString(),
      startTime: set(new Date(), { hours: 12, minutes: 30 }),
      endTime: set(new Date(), { hours: 15, minutes: 30 }),
    },
  });
}

export async function createActivityBooking(activityId: number, userId?: number) {
  const incomingUser = userId || (await createUser()).id;
  return prisma.activityBooking.create({
    data: {
      userId: incomingUser,
      activityId: activityId,
    },
  });
}
