/*
  Warnings:

  - You are about to drop the column `author_id` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `cook_time_minutes` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `cuisine_type` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty_level` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `prep_time_minutes` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `recipe_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_steps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ingredients` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_steps" DROP CONSTRAINT "recipe_steps_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_author_id_fkey";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "author_id",
DROP COLUMN "cook_time_minutes",
DROP COLUMN "cuisine_type",
DROP COLUMN "description",
DROP COLUMN "difficulty_level",
DROP COLUMN "prep_time_minutes",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "cook_time" INTEGER,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "ingredients" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "servings" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ADD COLUMN     "password_hash" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "recipe_ingredients";

-- DropTable
DROP TABLE "recipe_steps";

-- CreateIndex
CREATE INDEX "recipes_user_id_idx" ON "recipes"("user_id");

-- CreateIndex
CREATE INDEX "recipes_title_idx" ON "recipes"("title");

-- CreateIndex
CREATE INDEX "recipes_category_idx" ON "recipes"("category");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
