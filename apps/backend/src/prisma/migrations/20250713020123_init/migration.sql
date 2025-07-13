-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT[],
    "instructions" TEXT NOT NULL,
    "imageUrl" TEXT,
    "cookTime" INTEGER,
    "prepTime" INTEGER,
    "servings" INTEGER,
    "difficulty" "Difficulty",
    "tags" TEXT[],
    "cuisine" TEXT,
    "searchVector" tsvector,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "recipes_searchVector_idx" ON "recipes"("searchVector");

-- CreateIndex
CREATE INDEX "recipes_tags_idx" ON "recipes"("tags");

-- CreateIndex
CREATE INDEX "recipes_cuisine_idx" ON "recipes"("cuisine");

-- CreateIndex
CREATE INDEX "recipes_difficulty_idx" ON "recipes"("difficulty");

-- CreateIndex
CREATE INDEX "recipes_createdAt_idx" ON "recipes"("createdAt");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
