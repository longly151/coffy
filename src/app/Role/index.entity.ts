/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Max,
  IsNumber,
  Min
} from 'class-validator';
import { Permission } from '../Permission/index.entity';
import { User } from '../User/index.entity';
import { Base } from '../Common/Base/index.entity';
import { AccessControlList } from '../../common/enums/accessControlList.enum';
import { enumToArray } from '../../core/utils/helper';

@Entity('roles')
export class Role extends Base {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'ADMIN', description: "The name of user's Role" })
  @IsString()
  @Column()
  name: string;

  @IsString()
  @Column('text')
  description: string;

  // @IsOptional()
  // @ApiProperty({ writeOnly: true })
  // @IsIn(_.without(enumToArray(AccessControlList),AccessControlList.DEFAULT, AccessControlList.ALL), { each: true })
  // permissionIds: Array<string>;

  @IsOptional()
  @ApiProperty({ writeOnly: true, example: [2, 3] })
  @IsNumber({}, { each: true })
  @Min(2, { each: true })
  @Max(enumToArray(AccessControlList).length, { each: true })
  permissionIds: Array<number>;

  /**
   * Relations
   */

  @ApiProperty({ readOnly: true, writeOnly: true })
  @OneToMany((type) => User, (user) => user.role, { eager: false })
  users: User[];

  @ApiProperty({ readOnly: true })
  @ManyToMany((type) => Permission, (permission) => permission.roles, {
    cascade: true,
    eager: true
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id'
    }
  })
  permissions: Permission[];
}
