import { Test, TestingModule } from '@nestjs/testing';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/createMeetingRoom.dto';
import { UpdateMeetingRoomDto } from './dto/updateMeetingRoom.dto';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Repository } from 'typeorm';

describe('MeetingRoomService', () => {
  let service: MeetingRoomService;
  let repository: Repository<MeetingRoom>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingRoomService,
        {
          provide: getRepositoryToken(MeetingRoom),
          useValue: {
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeetingRoomService>(MeetingRoomService);
    repository = module.get<Repository<MeetingRoom>>(
      getRepositoryToken(MeetingRoom),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initData', () => {
    it('should save initial meeting rooms data', async () => {
      const room1 = new MeetingRoom();
      room1.name = '月球';
      room1.capacity = 10;
      room1.equipment = '白板';
      room1.location = '一层西';

      const room2 = new MeetingRoom();
      room2.name = '金星';
      room2.capacity = 5;
      room2.equipment = '';
      room2.location = '二层东';

      const room3 = new MeetingRoom();
      room3.name = '天王星';
      room3.capacity = 30;
      room3.equipment = '白板，电视';
      room3.location = '三层东';

      await service.initData();

      expect(repository.save).toHaveBeenCalledWith([room1, room2, room3]);
    });
  });

  describe('find', () => {
    it('should throw BadRequestException if pageNo is less than 1', async () => {
      await expect(service.find(0, 10, '', 0, '')).rejects.toThrow(
        new BadRequestException('页码最小为 1'),
      );
    });

    it('should find meeting rooms with specified conditions', async () => {
      const meetingRooms = [
        {
          id: 1,
          name: '月球',
          capacity: 10,
          equipment: '白板',
          location: '一层西',
        },
        { id: 2, name: '金星', capacity: 5, equipment: '', location: '二层东' },
      ];
      const totalCount = 2;

      const condition = {
        name: '月球',
        equipment: '白板',
        capacity: 10,
      };
    });
  });

  describe('create', () => {
    let createMeetingRoomDto: CreateMeetingRoomDto;

    beforeEach(() => {
      createMeetingRoomDto = {
        name: '火星',
        capacity: 20,
        equipment: '投影仪',
        location: '四层西',
        description: '描述',
      };
    });

    it('should create a new meeting room if it does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(repository, 'insert')
        .mockResolvedValueOnce({ identifiers: [1] } as any);

      const result = await service.create(createMeetingRoomDto);

      expect(result.identifiers).toEqual([1]);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: createMeetingRoomDto.name,
      });
      expect(repository.insert).toHaveBeenCalledWith(createMeetingRoomDto);
    });

    it('should throw BadRequestException if the meeting room already exists', async () => {
      const existingRoom = new MeetingRoom();
      existingRoom.name = '火星';

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(existingRoom);

      await expect(service.create(createMeetingRoomDto)).rejects.toThrow(
        new BadRequestException('会议室已存在'),
      );
    });
  });

  describe('update', () => {
    let updateMeetingRoomDto: UpdateMeetingRoomDto;

    beforeEach(() => {
      updateMeetingRoomDto = {
        id: 1,
        name: '更新后的火星',
        capacity: 25,
        equipment: '新的投影仪',
        location: '四层东',
        description: '更新后的描述',
      };
    });

    it('should update an existing meeting room', async () => {
      const meetingRoom = new MeetingRoom();
      meetingRoom.id = 1;
      meetingRoom.name = '火星';
      meetingRoom.capacity = 20;
      meetingRoom.equipment = '投影仪';
      meetingRoom.location = '四层西';

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(meetingRoom);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const result = await service.update(updateMeetingRoomDto);

      expect(result).toBe('success');
      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: updateMeetingRoomDto.id,
      });
      expect(repository.update).toHaveBeenCalledWith(
        { id: meetingRoom.id },
        expect.objectContaining({
          name: updateMeetingRoomDto.name,
          capacity: updateMeetingRoomDto.capacity,
          equipment: updateMeetingRoomDto.equipment,
          location: updateMeetingRoomDto.location,
          description: updateMeetingRoomDto.description,
        }),
      );
    });

    it('should throw BadRequestException if the meeting room does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.update(updateMeetingRoomDto)).rejects.toThrow(
        new BadRequestException('会议室不存在'),
      );
    });
  });

  describe('findByid', () => {
    it('should find a meeting room by id', async () => {
      const meetingRoom = new MeetingRoom();
      meetingRoom.id = 1;
      meetingRoom.name = '火星';
      meetingRoom.capacity = 20;
      meetingRoom.equipment = '投影仪';
      meetingRoom.location = '四层西';

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(meetingRoom);

      const result = await service.findByid(1);

      expect(result).toEqual(meetingRoom);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a meeting room by id', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const result = await service.delete(1);

      expect(result).toBe('success');
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
