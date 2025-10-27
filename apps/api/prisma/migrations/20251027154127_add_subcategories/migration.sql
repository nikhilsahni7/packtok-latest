-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "subcategories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "marketplace_products" ADD COLUMN     "subCategory" TEXT;
