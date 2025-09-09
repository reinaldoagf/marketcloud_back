// dto/user-response.dto.ts
import { UserStatus } from '@prisma/client';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  createdAt: Date;
  roleId: number | null;
  businessId: number | null;
}
