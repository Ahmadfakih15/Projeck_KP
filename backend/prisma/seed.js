const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin Sekretariat',
      nip: '198001012010011001',
      role: 'ADMIN',
      bidang: 'SEKRETARIAT',
    },
  });

  const pegawai = await prisma.user.upsert({
    where: { username: 'pegawai1' },
    update: {},
    create: {
      username: 'pegawai1',
      password: hashedPassword,
      name: 'Pegawai PTSP',
      nip: '199001012015011001',
      role: 'PEGAWAI',
      bidang: 'PTSP',
    },
  });

  console.log({ admin, pegawai });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
