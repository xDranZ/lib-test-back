import 'dotenv/config';
import dataSource from '../data-source';
import { hashPassword } from '../../auth/password-hasher';
import { User } from '../../users/entities/user.entity';

async function createAdmin() {
  await dataSource.initialize();

  const usersRepository = dataSource.getRepository(User);
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const name = process.env.ADMIN_NAME ?? 'Admin';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';

  const existingAdmin = await usersRepository.findOne({ where: { email } });
  const passwordHash = await hashPassword(password);

  if (existingAdmin) {
    await usersRepository.update(existingAdmin.id, {
      name,
      role: 'admin',
      passwordHash,
    });
  } else {
    await usersRepository.save(
      usersRepository.create({
        name,
        email,
        role: 'admin',
        passwordHash,
      }),
    );
  }

  await dataSource.destroy();
  console.log(`Admin ready: ${email}`);
}

createAdmin().catch(async (error) => {
  console.error(error);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
