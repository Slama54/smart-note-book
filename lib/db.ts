import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// User operations
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Notebook operations
export async function getNotebooksByUserId(userId: string) {
  return prisma.notebook.findMany({
    where: { userId },
    include: { chapters: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNotebookById(notebookId: string, userId: string) {
  return prisma.notebook.findFirst({
    where: { id: notebookId, userId },
    include: { chapters: { include: { pages: { orderBy: { order: 'asc' } } } } },
  });
}

export async function createNotebook(userId: string, title: string, description?: string) {
  return prisma.notebook.create({
    data: {
      userId,
      title,
      description,
    },
  });
}

export async function updateNotebook(notebookId: string, userId: string, data: { title?: string; description?: string; color?: string }) {
  return prisma.notebook.updateMany({
    where: { id: notebookId, userId },
    data,
  });
}

export async function deleteNotebook(notebookId: string, userId: string) {
  return prisma.notebook.deleteMany({
    where: { id: notebookId, userId },
  });
}

// Chapter operations
export async function getChaptersByNotebookId(notebookId: string, userId: string) {
  return prisma.chapter.findMany({
    where: {
      notebookId,
      notebook: { userId },
    },
    include: { pages: { orderBy: { order: 'asc' } } },
  });
}

export async function getChapterById(chapterId: string, userId: string) {
  return prisma.chapter.findFirst({
    where: {
      id: chapterId,
      notebook: { userId },
    },
    include: { pages: { orderBy: { order: 'asc' } } },
  });
}

export async function createChapter(notebookId: string, userId: string, title: string) {
  return prisma.chapter.create({
    data: {
      notebookId,
      title,
    },
  });
}

export async function updateChapter(chapterId: string, userId: string, title: string) {
  return prisma.chapter.updateMany({
    where: {
      id: chapterId,
      notebook: { userId },
    },
    data: { title },
  });
}

export async function deleteChapter(chapterId: string, userId: string) {
  return prisma.chapter.deleteMany({
    where: {
      id: chapterId,
      notebook: { userId },
    },
  });
}

// Page operations
export async function getPageById(pageId: string, userId: string) {
  return prisma.page.findFirst({
    where: {
      id: pageId,
      chapter: { notebook: { userId } },
    },
  });
}

export async function createPage(chapterId: string, userId: string, data: { content?: string; imageUrl?: string; text?: string }) {
  return prisma.page.create({
    data: {
      chapterId,
      ...data,
    },
  });
}

export async function updatePage(pageId: string, userId: string, data: { content?: string; imageUrl?: string; text?: string }) {
  return prisma.page.updateMany({
    where: {
      id: pageId,
      chapter: { notebook: { userId } },
    },
    data,
  });
}

export async function deletePage(pageId: string, userId: string) {
  return prisma.page.deleteMany({
    where: {
      id: pageId,
      chapter: { notebook: { userId } },
    },
  });
}
