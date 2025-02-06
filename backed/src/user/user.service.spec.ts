import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { RedisService } from '../redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        RedisService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    let registerUserDto: RegisterUserDto;

    beforeEach(() => {
      registerUserDto = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        nickName: 'Test User',
        captcha: '123456',
      };
    });

    it('should register a new user if all validations pass', async () => {
      jest
        .spyOn(redisService, 'get')
        .mockResolvedValue(registerUserDto.captcha);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(new User());

      const result = await service.register(registerUserDto);

      expect(result).toBe('注册成功');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception if the captcha is invalid', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue('invalidcaptcha');

      await expect(service.register(registerUserDto)).rejects.toThrow(
        new HttpException('验证码错误', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an exception if the username already exists', async () => {
      jest
        .spyOn(redisService, 'get')
        .mockResolvedValue(registerUserDto.captcha);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(new User());

      await expect(service.register(registerUserDto)).rejects.toThrow(
        new HttpException('用户名已存在', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
