// dto/supplier-response.dto.ts
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class SupplierResponseDto {
  id: string;
  user: UserResponseDto;
  branch: {
    id: string;
    country: string;
    state: string;
    city: string;
    address: string;
  };
  createdAt: Date;
}
