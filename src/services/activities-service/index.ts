import { cannotBookingError, notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request-error";
import activityRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getActivities(userId: number) {
  await checkTicketTypePaid(userId);

  const activities = await activityRepository.findActivities();

  if (activities.length === 0) throw notFoundError();
  return activities;
}

async function postActivitiesBooking(userId: number, activityId: number) {
  await checkTicketTypePaid(userId);
  if (isNaN(activityId) || activityId < 1) throw badRequestError();

  const activity = await activityRepository.findActivityById(activityId);
  await checkActivityCapacity(activity.id, activity.capacity);

  const newActivityBooking = await activityRepository.createActivityBooking(activityId, userId);
  return {
    activityBookingId: newActivityBooking.id,
  };
}

async function checkTicketTypePaid(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) throw cannotBookingError();
}

async function checkActivityCapacity(activityId: number, capacity: number) {
  const activityBooking = await activityRepository.findActivityBooking(activityId);

  if (capacity === activityBooking.length) throw cannotBookingError();
}

const activitiesService = {
  getActivities,
  postActivitiesBooking,
};

export default activitiesService;
