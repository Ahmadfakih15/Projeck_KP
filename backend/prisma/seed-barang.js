const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.barang.createMany({
    data: [
      { nama: 'Kertas HVS A4', stok: 50, limitStok: 10, kategori: 'ATK' },
      { nama: 'Tinta Printer Epson', stok: 5, limitStok: 10, kategori: 'ATK' },
      { nama: 'PC Loket 1', stok: 1, limitStok: 1, kategori: 'ASET' },
      { nama: 'Meja Kerja', stok: 10, limitStok: 2, kategori: 'ASET' },
    ],
    skipDuplicates: true
  });
  console.log('Seeded Barang');
}

main().catch(console.error).finally(() => prisma.$disconnect());
