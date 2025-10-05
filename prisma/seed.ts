// seed.ts
import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

async function main(): Promise<void> {
  const passwordPlain = '12345678';
  const hashedPassword: string = await bcrypt.hash(passwordPlain, 10);

  const usersData = Array.from({ length: 5 }).map((_, index) => ({
    email: `user${index + 1}@test.com`,
    name: `User ${index + 1}`,
    username: `username${index + 1}`,
    dni: `${index + 1}0000`,
    state: `estado bolívar`,
    city: `ciudad guayana`,
    password: hashedPassword,
    status: UserStatus.active,
  }));

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true, // evita errores si corres varias veces
  });

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        name: 'Administrador',
        username: 'admin',
        dni: '0000000',
        state: `estado bolívar`,
        city: `ciudad guayana`,
        password: hashedPassword,
        status: UserStatus.active,
        hasAllPermissions: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Usuarios creados con contraseña encriptada');

  await prisma.permission.createMany({
    data: [
      {
        type: 'view',
      },
      {
        type: 'update',
      },
      {
        type: 'delete',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Permisos creados exitosamente');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
