import { prisma } from "@packtok/db";

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: tsx scripts/print-product.ts <productId>");
    process.exit(1);
  }
  const p = await prisma.marketplaceProduct.findUnique({ where: { id } });
  if (!p) {
    console.error("Product not found", id);
    process.exit(2);
  }
  console.log(JSON.stringify(p, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
