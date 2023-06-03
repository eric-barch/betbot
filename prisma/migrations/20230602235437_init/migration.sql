-- DropIndex
DROP INDEX "Odd_value_key";

-- AlterTable
ALTER TABLE "Odd" ALTER COLUMN "value" DROP NOT NULL;
