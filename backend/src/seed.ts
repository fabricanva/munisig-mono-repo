import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const usersToCreate = [
        { username: 'user1', firstName: 'Juan', lastName: 'Perez', role: UserRole.WORKER, email: 'juan@test.com' },
        { username: 'user2', firstName: 'Maria', lastName: 'Gomez', role: UserRole.WORKER, email: 'maria@test.com' },
        { username: 'user3', firstName: 'Carlos', lastName: 'Lopez', role: UserRole.WORKER, email: 'carlos@test.com' },
        { username: 'user4', firstName: 'Ana', lastName: 'Martinez', role: UserRole.WORKER, email: 'ana@test.com' },
    ];

    for (const u of usersToCreate) {
        try {
            const existing = await usersService.findOneByUsername(u.username);
            if (existing) {
                console.log(`User ${u.username} already exists`);
                continue;
            }

            const res = await usersService.createByAdmin(u as any);
            console.log(`Created user ${u.username} with password ${res.temporaryPassword}`);
        } catch (e) {
            console.error(`Failed to create ${u.username}:`, e.message);
        }
    }

    await app.close();
}
bootstrap();
