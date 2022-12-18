import app, { init } from "@/app";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createActivity, createActivityBooking } from "../factories/activities-factory";
import { createPlace } from "../factories/place-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities");

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 403 if user has not enrolled yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeWithHotel();

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if the ticket isn't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if the TicketType is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    describe("when TicketType is valid", () => {
      it("should respond with status 200 and the activities", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const place = await createPlace();

        const activity = await createActivity(place.id);
        const activityBooking = await createActivityBooking(activity.id, user.id);
        const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: activity.id,
            title: activity.title,
            capacity: activity.capacity,
            placeId: activity.placeId,
            Place: {
              id: place.id,
              name: place.name,
              createdAt: place.createdAt.toISOString(),
              updatedAt: place.updatedAt.toISOString(),
            },
            ActivityBooking: [
              {
                id: activityBooking.id,
                userId: activityBooking.userId,
                activityId: activityBooking.activityId,
                createdAt: activityBooking.createdAt.toISOString(),
                updatedAt: activityBooking.updatedAt.toISOString(),
              },
            ],
            date: expect.any(String || Date),
            startTime: expect.any(String || Date),
            endTime: expect.any(String || Date),
            createdAt: activity.createdAt.toISOString(),
            updatedAt: activity.updatedAt.toISOString(),
          },
        ]);
      });
    });
  });
});

describe("POST /activities/:activityId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/activities/:activityId");

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/activities/:activityId").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/activities/:activityId").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 403 if user has not enrolled yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeWithHotel();

      const response = await server.post("/activities/:activityId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if the ticket isn't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post("/activities/:activityId").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if the TicketType is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post("/activities/:activityId").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    describe("when TicketType is valid", () => {
      it("should respond with status 400 if the activity params isn't a number", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const word = faker.name.firstName();

        const response = await server.post(`/activities/${word}`).set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 400 if the activityId params isn't valid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const number = 0;

        const response = await server.post(`/activities/${number}`).set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 404 if the activityId params doesn't exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const number = faker.datatype.number({ min: 50 });

        const response = await server.post(`/activities/${number}`).set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 if the activity is full", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const place = await createPlace();

        const activity = await createActivity(place.id);

        for (let i = 0; i < activity.capacity; i++) {
          await createActivityBooking(activity.id);
        }
        const response = await server.post(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
      });

      it("should respond with status 200 and with activityBookingId created", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const place = await createPlace();

        const activity = await createActivity(place.id);

        const response = await server.post(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          activityBookingId: expect.any(Number),
        });
      });
    });
  });
});
