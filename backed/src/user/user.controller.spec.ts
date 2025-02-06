import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginUserVo } from './vo/loginUser.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.dto';
import { UpdateUserDto } from './dto/updateUserDto';
import { UserInfo } from 'src/custom.decorator';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        JwtService,
        ConfigService,
        RedisService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue({
        register: jest.fn(),
        login: jest.fn(),
        findUserById: jest.fn(),
        findUserDetailById: jest.fn(),
        updatePassword: jest.fn(),
        update: jest.fn(),
        freezeUserById: jest.fn(),
        findUsersByPage: jest.fn(),
        findUsers: jest.fn(),
      })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn(),
        verify: jest.fn(),
      })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn(),
      })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('adminLogin', () => {
    let loginUserDto: LoginUserDto;
    let loginUserVo: LoginUserVo;

    beforeEach(() => {
      loginUserDto = {
        username: 'admin',
        password: 'password123',
        captcha: '123456',
      };

      loginUserVo = new LoginUserVo();
      loginUserVo.userInfo = {
        id: 1,
        username: 'admin',
        nickName: 'Admin User',
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        headPic: '',
        createTime: new Date().getTime(),
        isFrozen: false,
        isAdmin: true,
        roles: ['admin'],
        permissions: ['admin:manage'],
      };
    });

    it('should return a LoginUserVo with access and refresh tokens on successful login', async () => {
      jest.spyOn(userService, 'login').mockResolvedValue(loginUserVo);
      jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');
      jest.spyOn(configService, 'get').mockReturnValue('30m');

      const result = await controller.adminLogin(loginUserDto);

      expect(result).toEqual({
        ...loginUserVo,
        accessToken: 'access_token',
        refreshToken: 'access_token', // 注意：这里假设 access_token 和 refresh_token 相同，实际应不同
      });
      expect(userService.login).toHaveBeenCalledWith(loginUserDto, true);
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          userId: loginUserVo.userInfo.id,
          username: loginUserVo.userInfo.username,
          roles: loginUserVo.userInfo.roles,
          permissions: loginUserVo.userInfo.permissions,
        },
        {
          expiresIn: '30m',
        },
      );
    });

    it('should throw BadRequestException if login fails', async () => {
      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new BadRequestException('用户不存在'));

      await expect(controller.adminLogin(loginUserDto)).rejects.toThrow(
        new BadRequestException('用户不存在'),
      );
    });
  });

  describe('refresh', () => {
    let user: User;
    let loginUserVo: LoginUserVo;

    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.username = 'user';
      user.roles = ['user'];
      user.permissions = ['user:read'];

      loginUserVo = new LoginUserVo();
      loginUserVo.userInfo = {
        id: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
        nickName: 'User',
        email: 'user@example.com',
        phoneNumber: '1234567890',
        headPic: '',
        createTime: new Date().getTime(),
        isFrozen: false,
        isAdmin: false,
      };
    });

    it('should return access and refresh tokens on successful token refresh', async () => {
      const decodedToken = { userId: user.id };
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(loginUserVo.userInfo);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await controller.refresh('refresh_token');

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      expect(jwtService.verify).toHaveBeenCalledWith('refresh_token');
      expect(userService.findUserById).toHaveBeenCalledWith(
        decodedToken.userId,
        false,
      );
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new UnauthorizedException('token 已失效，请重新登录');
      });

      await expect(controller.refresh('invalid_token')).rejects.toThrow(
        new UnauthorizedException('token 已失效，请重新登录'),
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const decodedToken = { userId: 999 };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
      jest.spyOn(userService, 'findUserById').mockResolvedValue(null);

      await expect(controller.refresh('refresh_token')).rejects.toThrow(
        new UnauthorizedException('token 已失效，请重新登录'),
      );
    });
  });
});
