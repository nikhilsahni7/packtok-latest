import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const productId = "cmj4dlo090001ykssljwyx0oe";
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    include: { category: true }
  });

  console.log(JSON.stringify(product, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
