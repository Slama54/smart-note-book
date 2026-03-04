-- CreateEnum
CREATE TYPE "CoverPattern" AS ENUM ('dots', 'lines', 'grid', 'plain');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "notebook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_color" TEXT NOT NULL DEFAULT '#2E7D32',
    "cover_pattern" "CoverPattern",
    "page_count" INTEGER NOT NULL DEFAULT 0,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_edited" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter" (
    "id" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#FF6B6B',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "page_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "image_url" TEXT,
    "text" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "qr_code_value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notebook_id" TEXT,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_on_page" (
    "page_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "tag_on_page_pkey" PRIMARY KEY ("page_id","tag_id")
);

-- CreateTable
CREATE TABLE "graph" (
    "id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "coordinates" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "page_id" TEXT,
    "chapter_id" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "question_text" TEXT NOT NULL,
    "options" JSONB,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_embedding" (
    "id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "model_version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notebook_id" TEXT,
    "chapter_id" TEXT,
    "page_id" TEXT,
    "user_message" TEXT NOT NULL,
    "ai_response" TEXT NOT NULL,
    "sources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "page_id" TEXT,
    "status" "ScanStatus" NOT NULL,
    "image_url" TEXT NOT NULL,
    "qr_code_value" TEXT,
    "error_message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "scan_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFavoritePages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFavoritePages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "notebook_userId_idx" ON "notebook"("userId");

-- CreateIndex
CREATE INDEX "notebook_is_archived_idx" ON "notebook"("is_archived");

-- CreateIndex
CREATE UNIQUE INDEX "notebook_userId_name_key" ON "notebook"("userId", "name");

-- CreateIndex
CREATE INDEX "chapter_notebookId_idx" ON "chapter"("notebookId");

-- CreateIndex
CREATE UNIQUE INDEX "chapter_notebookId_name_key" ON "chapter"("notebookId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "page_qr_code_value_key" ON "page"("qr_code_value");

-- CreateIndex
CREATE INDEX "page_chapterId_idx" ON "page"("chapterId");

-- CreateIndex
CREATE INDEX "page_qr_code_value_idx" ON "page"("qr_code_value");

-- CreateIndex
CREATE INDEX "page_is_favorite_idx" ON "page"("is_favorite");

-- CreateIndex
CREATE UNIQUE INDEX "page_chapterId_page_number_key" ON "page"("chapterId", "page_number");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE INDEX "graph_page_id_idx" ON "graph"("page_id");

-- CreateIndex
CREATE INDEX "question_page_id_idx" ON "question"("page_id");

-- CreateIndex
CREATE INDEX "question_chapter_id_idx" ON "question"("chapter_id");

-- CreateIndex
CREATE INDEX "question_questionType_idx" ON "question"("questionType");

-- CreateIndex
CREATE INDEX "question_difficulty_idx" ON "question"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "page_embedding_page_id_key" ON "page_embedding"("page_id");

-- CreateIndex
CREATE INDEX "page_embedding_page_id_idx" ON "page_embedding"("page_id");

-- CreateIndex
CREATE INDEX "chat_history_user_id_idx" ON "chat_history"("user_id");

-- CreateIndex
CREATE INDEX "chat_history_notebook_id_idx" ON "chat_history"("notebook_id");

-- CreateIndex
CREATE INDEX "chat_history_chapter_id_idx" ON "chat_history"("chapter_id");

-- CreateIndex
CREATE INDEX "chat_history_page_id_idx" ON "chat_history"("page_id");

-- CreateIndex
CREATE INDEX "scan_history_user_id_idx" ON "scan_history"("user_id");

-- CreateIndex
CREATE INDEX "scan_history_status_idx" ON "scan_history"("status");

-- CreateIndex
CREATE INDEX "_UserFavoritePages_B_index" ON "_UserFavoritePages"("B");

-- AddForeignKey
ALTER TABLE "notebook" ADD CONSTRAINT "notebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_notebook_id_fkey" FOREIGN KEY ("notebook_id") REFERENCES "notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_on_page" ADD CONSTRAINT "tag_on_page_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_on_page" ADD CONSTRAINT "tag_on_page_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graph" ADD CONSTRAINT "graph_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_embedding" ADD CONSTRAINT "page_embedding_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_notebook_id_fkey" FOREIGN KEY ("notebook_id") REFERENCES "notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_history" ADD CONSTRAINT "scan_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_history" ADD CONSTRAINT "scan_history_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePages" ADD CONSTRAINT "_UserFavoritePages_A_fkey" FOREIGN KEY ("A") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePages" ADD CONSTRAINT "_UserFavoritePages_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
