import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activity-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivity(req: AuthenticatedRequest, res: Response) {
  const { eventId } = req.params;
  const { userId } = req;

  try {
    const activities = await activityService.getActivities(userId, Number(eventId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "CannotBookingError") return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === "BadRequestError") return res.sendStatus(httpStatus.BAD_REQUEST);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
