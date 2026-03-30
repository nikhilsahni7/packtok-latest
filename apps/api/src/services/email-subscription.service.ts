import { prisma } from "@packtok/db";
import { Resend } from "resend";
import config from "../config";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

export type EmailSubscriptionType = "PODCAST" | "NEWSLETTER";

type SubscribeInput = {
  email: string;
  type: EmailSubscriptionType;
};

type EmailSubscriptionRecord = {
  id: string;
  email: string;
  type: EmailSubscriptionType;
  createdAt: Date;
  updatedAt: Date;
};

type EmailSubscriptionDelegate = {
  findUnique: (args: {
    where: { email_type: { email: string; type: EmailSubscriptionType } };
  }) => Promise<EmailSubscriptionRecord | null>;
  create: (args: {
    data: { email: string; type: EmailSubscriptionType };
  }) => Promise<EmailSubscriptionRecord>;
  delete: (args: { where: { id: string } }) => Promise<EmailSubscriptionRecord>;
};

type PrismaWithEmailSubscriptions = {
  emailSubscription: EmailSubscriptionDelegate;
};

const resend = new Resend(config.resend.apiKey);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getTemplateContent = (type: EmailSubscriptionType) => {
  if (type === "PODCAST") {
    return {
      title: "You are in for Podcast Drops",
      body: "You will now get fresh Packtok episodes, industry stories, and behind-the-scenes picks right in your inbox.",
      badge: "Podcast Alert Enabled",
    };
  }

  return {
    title: "Welcome to the Packtok Newsletter",
    body: "You are subscribed for curated updates on products, trends, offers, and practical packaging insights.",
    badge: "Newsletter Active",
  };
};

const buildSubscriptionEmailHtml = (
  recipientEmail: string,
  type: EmailSubscriptionType
) => {
  const content = getTemplateContent(type);

  return `
  <div style="margin:0;padding:0;background:#f5f7fb;font-family:Inter,Segoe UI,Arial,sans-serif;color:#101828;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 24px 48px rgba(16,24,40,0.14);">
            <tr>
              <td style="padding:0;background:linear-gradient(135deg,#111827 0%,#ea580c 100%);">
                <div style="padding:36px 34px;">
                  <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#fed7aa;font-weight:700;">Packtok Subscription</p>
                  <h1 style="margin:0;font-size:30px;line-height:1.2;color:#ffffff;font-weight:800;">${content.title}</h1>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px;">
                <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:#fff7ed;color:#c2410c;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">${content.badge}</span>
                <p style="margin:20px 0 12px 0;font-size:16px;line-height:1.7;color:#344054;">${content.body}</p>
                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475467;">Subscription email: <strong>${recipientEmail}</strong></p>
                <div style="margin-top:24px;padding:16px 18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#475467;">If this was not you, reply to this email and our team will help immediately.</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
};

const sendSubscriptionEmail = async (
  to: string,
  type: EmailSubscriptionType
): Promise<void> => {
  const subject =
    type === "PODCAST"
      ? "Podcast subscription confirmed"
      : "Newsletter subscription confirmed";

  const result = await resend.emails.send({
    from: config.resend.fromEmail,
    to,
    subject,
    html: buildSubscriptionEmailHtml(to, type),
  });

  if (result.error) {
    logger.error(
      { to, type, error: result.error },
      "Subscription email failed"
    );
    throw new ApiError(
      502,
      "Your subscription was not completed because email delivery failed. Please try again."
    );
  }
};

export const subscribeToEmailUpdates = async (input: SubscribeInput) => {
  const email = input.email.trim().toLowerCase();

  if (!emailPattern.test(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  const prismaWithEmail = prisma as unknown as PrismaWithEmailSubscriptions;

  const existing = await prismaWithEmail.emailSubscription.findUnique({
    where: {
      email_type: {
        email,
        type: input.type,
      },
    },
  });

  if (existing) {
    return { subscription: existing, alreadySubscribed: true };
  }

  const created = await prismaWithEmail.emailSubscription.create({
    data: {
      email,
      type: input.type,
    },
  });

  try {
    await sendSubscriptionEmail(email, input.type);
  } catch (error) {
    await prismaWithEmail.emailSubscription
      .delete({ where: { id: created.id } })
      .catch(() => {
        // Best-effort rollback if email delivery fails.
      });
    throw error;
  }

  return { subscription: created, alreadySubscribed: false };
};

export const listEmailSubscriptionsForAdmin = async (params?: {
  page?: number;
  limit?: number;
  type?: EmailSubscriptionType;
}) => {
  const safePage = params?.page && params.page > 0 ? params.page : 1;
  const safeLimit =
    params?.limit && params.limit > 0 ? Math.min(params.limit, 100) : 20;
  const skip = (safePage - 1) * safeLimit;

  const where = params?.type ? { type: params.type } : undefined;

  const [data, total, podcastCount, newsletterCount] = await Promise.all([
    prisma.emailSubscription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
    }),
    prisma.emailSubscription.count({ where }),
    prisma.emailSubscription.count({ where: { type: "PODCAST" } }),
    prisma.emailSubscription.count({ where: { type: "NEWSLETTER" } }),
  ]);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      hasNext: skip + data.length < total,
    },
    summary: {
      totalAll: podcastCount + newsletterCount,
      podcast: podcastCount,
      newsletter: newsletterCount,
    },
  };
};
