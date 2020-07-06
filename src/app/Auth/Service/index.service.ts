import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { getValueOfKeyFromCollection } from '@src/core/utils/helper';
import { getManager } from 'typeorm';
import { UserRepository } from '@src/app/User/Repository/index.repository';
import Bcrypt from '../../../plugins/bcrypt.plugin';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOneByEmail(email);
    const isValid: boolean = await Bcrypt.compare(pass, user.password);
    if (user && isValid) {
      user.hasExpiredToken = false;
      await this.userRepository.save(user);
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = await this.validateUser(user.email, user.password);
    const permissions = getValueOfKeyFromCollection(
      payload.role.permissions,
      'name'
    );
    return {
      token: this.jwtService.sign({
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName,
        phone: payload.phone,
        avatar: payload.avatar,
        gender: payload.gender,
        birthday: payload.birthday,
        bio: payload.bio,
        note: payload.note,
        status: payload.status,
        role: payload.role.name,
        permissions,
        table: 'users',
        idForeignKey: 'userId'
      }),
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      avatar: payload.avatar,
      role: payload.role.name
    };
  }
}
