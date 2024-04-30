import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  code: string;
}
