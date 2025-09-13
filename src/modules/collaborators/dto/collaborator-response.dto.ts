// dto/user-response.dto.ts
import { BusinessBranch } from '@prisma/client';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CollaboratorResponseDto {
  id: number;
  user: UserResponseDto;
  branch: {
    id: number;
    country: string;
    state: string;
    city: string;
    address: string;
  };
  createdAt: Date;
}
