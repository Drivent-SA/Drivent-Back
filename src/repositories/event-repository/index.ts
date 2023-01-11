import { prisma, redis } from "@/config";
import { Event } from "@prisma/client";

async function findFirst() {
  let event: Event = JSON.parse(await redis.get("event"));

  if (!event) {
    const day = 86400;

    event = await prisma.event.findFirst();

    await redis.set("event", JSON.stringify(event), {
      EX: day,
    });
  }

  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
