import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty()
  phone: string;
}
