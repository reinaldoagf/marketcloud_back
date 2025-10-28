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

  /* const usersData = Array.from({ length: 5 }).map((_, index) => ({
    email: `user${index + 1}@test.com`,
    name: `User ${index + 1}`,
    username: `username${index + 1}`,
    dni: `${index + 1}0000`,
    state: `Bolívar`,
    city: `Ciudad Guayana`,
    password: hashedPassword,
    status: UserStatus.activo,
  }));

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true, // evita errores si corres varias veces
  }); */

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        name: 'Administrador',
        username: 'admin',
        dni: '0000000',
        state: `Bolívar`,
        city: `Ciudad Guayana`,
        password: hashedPassword,
        status: UserStatus.activo,
        hasAllPermissions: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Usuarios creados con contraseña encriptada');
/* 
  await prisma.permission.createMany({
    data: [
      {
        type: 'vista',
      },
      {
        type: 'actualizar',
      },
      {
        type: 'eliminar',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Permisos creados exitosamente');

  await prisma.productBrand.createMany({
    data: [
      {
        name: 'FritoLay',
      },
      {
        name: 'Minalba',
      },
      {
        name: 'Lipton',
      },
      {
        name: 'Flips',
      },
      {
        name: 'PAN',
      },
      {
        name: 'ACE',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Marcas creadas exitosamente');

  await prisma.productCategory.createMany({
    data: [
      {
        name: 'Productos de Limpieza',
      },
      {
        name: 'Dulces',
      },
      {
        name: 'Bebidas',
      },
      {
        name: 'Alimentos',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Categorías creadas exitosamente'); */
}

main()
  .catch((e: unknown) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
