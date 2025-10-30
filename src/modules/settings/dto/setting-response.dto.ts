// dto/setting-response.dto.ts
export class SettingResponseDto {
  id: string;
  key: string;
  floatValue?: number | null;
  stringValue?: string | null;
  userId?: string | null;
  businessId?: string | null;
  branchId?: string | null;
  createdAt: Date;
}
