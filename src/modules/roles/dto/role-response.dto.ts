export class RoleResponseDto {
  id: string;
  key: string;
  name: string;
  createdAt: Date;
  permissions?: any[];
  pages?: any[];
}
