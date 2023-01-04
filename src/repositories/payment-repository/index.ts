import { prisma } from "@/config";
import { Payment } from "@prisma/client";
import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    }
  });
}

async function createPayment(ticketId: number, params: PaymentParams) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    }
  });
}

async function transactionPayment(ticketId: number, paymentData: PaymentDataParams) {
  return prisma.$transaction(async () => {
    const payment = await createPayment(ticketId, paymentData);
    await ticketRepository.ticketProcessPayment(ticketId);

    if (!payment) {
      throw notFoundError();
    }

    return payment;
  });
}

export type PaymentDataParams = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
  transactionPayment
};

export default paymentRepository;
