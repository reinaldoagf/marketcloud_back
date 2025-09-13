// dto/user-response.dto.ts
import { UserStatus } from '@prisma/client';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  createdAt: Date;
  roleId: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  businessId: number | null;
}
