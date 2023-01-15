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
async function transactionEnrollmentAndAdress(
  enrollmentId: number,
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams,
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  ) {

  const enrollment = prisma.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
  });

  const adress = prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });

  return prisma.$transaction([enrollment, adress])
  
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
