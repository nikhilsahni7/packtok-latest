import { prisma } from "@packtok/db";

export const createContactInquiry = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  return await prisma.contactInquiry.create({
    data,
  });
};

export const getAllContactInquiries = async () => {
  return await prisma.contactInquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markAsHandled = async (id: string) => {
  return await prisma.contactInquiry.update({
    where: { id },
    data: { isHandled: true },
  });
};
