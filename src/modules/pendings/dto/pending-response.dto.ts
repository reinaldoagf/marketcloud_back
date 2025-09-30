// dto/pending-response.dto.ts
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PendingResponseDto {
  id: number;
  title: string;
  message: string;
  createdBy: UserResponseDto | null;
  linkedUser: UserResponseDto | null;
  eventDate: Date | null;
  branch: {
    id: number;
    country: string;
    state: string;
    city: string;
    address: string;
  };
  createdAt: Date;
}
