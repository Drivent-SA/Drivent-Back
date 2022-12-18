import { getActivities, postActivityBooking } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("/", getActivities).post("/:activityId", postActivityBooking);

export { activitiesRouter };
