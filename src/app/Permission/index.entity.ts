/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../Role/index.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'USER_CREATE',
    description: 'The name of permission'
  })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ example: '', description: 'The description of permission' })
  @IsString()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ readOnly: true })
  @ManyToMany((type) => Role, (role) => role.permissions)
  roles: Role[];
}
