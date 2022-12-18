import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const activities = await activitiesService.getActivities(userId);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "CannotBookingError") return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === "BadRequestError") return res.sendStatus(httpStatus.BAD_REQUEST);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postActivityBooking(req: AuthenticatedRequest, res: Response) {
  const { activityId } = req.params;
  const { userId } = req;

  try {
    const activityBooking = await activitiesService.postActivitiesBooking(userId, Number(activityId));
    return res.status(httpStatus.OK).send(activityBooking);
  } catch (error) {
    if (error.name === "CannotBookingError") return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === "BadRequestError") return res.sendStatus(httpStatus.BAD_REQUEST);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
