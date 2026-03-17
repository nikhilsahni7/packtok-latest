import { Prisma, prisma } from "@packtok/db";
import { ApiError } from "../utils/apiError";
import { notifyArticlePublished } from "./notification.service";

type ArticleCreateInput = {
  title: string;
  content: string;
  coverImage?: string;
  published?: boolean;
};

type ArticleUpdateInput = Partial<ArticleCreateInput>;

export const listArticlesForAdmin = async () => {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const getArticleByIdForAdmin = async (id: string) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return article;
};

export const createArticleForAdmin = async (
  authorId: string,
  data: ArticleCreateInput
) => {
  const created = await prisma.article.create({
    data: {
      title: data.title.trim(),
      content: data.content.trim(),
      coverImage: data.coverImage?.trim() || null,
      published: data.published ?? false,
      authorId,
    },
  });

  if (created.published) {
    await notifyArticlePublished({
      articleId: created.id,
      title: created.title,
    });
  }

  return created;
};

export const updateArticleForAdmin = async (
  id: string,
  data: ArticleUpdateInput
) => {
  const existing = await getArticleByIdForAdmin(id);

  const payload: Prisma.ArticleUpdateInput = {};
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.content !== undefined) payload.content = data.content.trim();
  if (data.coverImage !== undefined) {
    payload.coverImage = data.coverImage?.trim() || null;
  }
  if (data.published !== undefined) payload.published = data.published;

  const updated = await prisma.article.update({
    where: { id },
    data: payload,
  });

  if (!existing.published && updated.published) {
    await notifyArticlePublished({
      articleId: updated.id,
      title: updated.title,
    });
  }

  return updated;
};

export const deleteArticleForAdmin = async (id: string) => {
  await getArticleByIdForAdmin(id);
  await prisma.article.delete({ where: { id } });
};

export const listPublishedArticles = async (limit?: number) => {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });
};

export const getPublishedArticleById = async (id: string) => {
  const article = await prisma.article.findFirst({
    where: { id, published: true },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return article;
};
