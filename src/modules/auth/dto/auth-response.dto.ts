import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: Record<string, any>; // puedes crear un UserResponseDto si prefieres
}
