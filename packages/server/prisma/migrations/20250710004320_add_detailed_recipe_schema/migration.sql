/*
  Warnings:

  - You are about to drop the column `ingredients` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `recipes` table. All the data in the column will be lost.
  - Added the required column `cook_time_minutes` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prep_time_minutes` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servings` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "ingredients",
DROP COLUMN "instructions",
ADD COLUMN     "cook_time_minutes" INTEGER NOT NULL,
ADD COLUMN     "cuisine_type" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty_level" TEXT,
ADD COLUMN     "prep_time_minutes" INTEGER NOT NULL,
ADD COLUMN     "servings" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "unit" TEXT,
    "notes" TEXT,
    "order_index" INTEGER NOT NULL,
    "recipe_id" TEXT NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_steps" (
    "id" TEXT NOT NULL,
    "step_number" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "time_minutes" INTEGER,
    "temperature" TEXT,
    "recipe_id" TEXT NOT NULL,

    CONSTRAINT "recipe_steps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
