export class RoleResponseDto {
  id: number;
  key: string;
  name: string;
  createdAt: Date;
  permissions?: any[];
  pages?: any[];
}
