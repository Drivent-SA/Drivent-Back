import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";
import { Address } from "@prisma/client";

async function upsert(enrollmentId: number, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  return prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
}

function upsertEnrollment(userId: number, createdEnrollment: CreateEnrollmentParams,  updatedEnrollment: UpdateEnrollmentParams) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

function upsertAddress(enrollmentId: number, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  return prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
}

async function transactionEnrollmentAndAdress(
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams,
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.$transaction(async () => {
    const enrollment = await upsertEnrollment(userId, createdEnrollment, updatedEnrollment);
    await upsertAddress(enrollment.id, createdAddress, updatedAddress);
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;
export type CreateAddressParams = Omit<Address, "id" | "createdAt" | "updatedAt" | "enrollmentId">;
export type UpdateAddressParams = CreateAddressParams;

const addressRepository = {
  upsert,
  transactionEnrollmentAndAdress
};

export default addressRepository;
