// dto/user-response.dto.ts
import { UserStatus } from '@prisma/client';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  country: string | null;
  state: string | null;
  city: string | null;
  roleId: string | null;
  businessId: string | null;
  createdAt: Date;
}
