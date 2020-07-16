import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  JoinColumn,
  OneToMany
} from 'typeorm';
import {
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  IsBoolean,
  IsDate,
  IsDateString
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../Role/Enum/userRole.enum';
import Bcrypt from '../../plugins/bcrypt.plugin';
import { Role } from '../Role/role.entity';
import { UserStatus } from '../../common/enums/userStatus.enum';
import { Base } from '../Common/Base/base.entity';
import { enumToArray } from '../../core/utils/helper';
import { Gender } from '../../common/enums/gender.enum';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('users')
@Unique(['email'])
export class User extends Base {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Admin' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  fullName: string;

  @ApiProperty({ example: 'member@gmail.com' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty({ example: 'admin' })
  @ApiProperty({ writeOnly: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  password: string;

  @ApiProperty({ example: '0371627261' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  phone: string;

  @ApiProperty({
    example:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU'
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  avatar: string;

  @ApiProperty({ example: 'MALE' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsIn(enumToArray(Gender))
  @Column({
    type: 'enum',
    enum: Gender
  })
  gender: string;

  @ApiProperty({ example: '2011-10-05T14:48:00.000Z' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsDateString()
  @Column()
  birthday: Date;

  @ApiProperty({ example: 'Hello there' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  bio: string;

  @ApiProperty({ example: 'Note something' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  note: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsIn(enumToArray(UserStatus))
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: string;

  @Exclude()
  @ApiProperty({ readOnly: true, writeOnly: true })
  @IsOptional()
  @IsBoolean()
  @Column({ default: false })
  hasExpiredToken: boolean;

  /**
   * Relations
   */
  @ApiProperty({ readOnly: true })
  @ManyToOne((type) => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsIn([2, 3])
  @Column()
  roleId: number;

  // @OneToMany((type) => Pet, (pet) => pet.user)
  // pets: Pet[]

  /**
   * Trigger
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const userRepository = await User.getRepository();
    const dbCurrentUser = await userRepository.findOne(this.id);

    if (this.password && this.password !== dbCurrentUser.password)
      this.password = await Bcrypt.hash(this.password);
  }
}
