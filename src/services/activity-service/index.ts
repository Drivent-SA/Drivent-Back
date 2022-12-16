import { cannotBookingError, notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request-error";
import activityRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getActivities(userId: number, eventId: number) {
  await checkTicketTypePaid(userId);
  if (isNaN(eventId) || eventId < 1) throw badRequestError();

  const activities = await activityRepository.findActivities(eventId);

  if (activities.length === 0) throw notFoundError();
  return activities;
}

async function checkTicketTypePaid(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) throw cannotBookingError();
}

const activityService = {
  getActivities,
};

export default activityService;
