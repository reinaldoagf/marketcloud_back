// dto/client-response.dto.ts
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ClientResponseDto {
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
