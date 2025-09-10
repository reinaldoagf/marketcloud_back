import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  omit: {
        user: { // Replace 'user' with your model name if different
          password: true,
        },
      },
});

async function main(): Promise<void> {
  const passwordPlain = '12345678';
  const hashedPassword: string = await bcrypt.hash(passwordPlain, 10);

  const usersData = Array.from({ length: 25 }).map((_, index) => ({
    email: `user${index + 1}@test.com`,
    name: `User ${index + 1}`,
    username: `username${index + 1}`,
    dni: `${index + 1}0000`,
    password: hashedPassword,
    status: 'active' as const, // tipado seguro
  }));

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true, // evita errores si corres varias veces
  });

  console.log('✅ 25 usuarios creados con contraseña encriptada');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
