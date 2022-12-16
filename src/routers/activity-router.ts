import { getActivity, postActivityBooking } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activityRouter = Router();

activityRouter.all("/*", authenticateToken).get("/:eventId", getActivity).post("/:activityId", postActivityBooking);

export { activityRouter };
