import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMeetingRoomDto } from './createMeetingRoom.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
  @ApiProperty()
  @IsNotEmpty({
    message: 'id 不能为空',
  })
  id: number;
}
