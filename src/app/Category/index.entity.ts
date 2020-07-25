/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeParent,
  TreeChildren,
  Tree,
  Unique,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEmpty,
  IsIn
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Product } from '../Product/index.entity';
import { enumToArray } from '../../core/utils/helper';
import { TreeBase } from '../Common/TreeBase/index.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('categories')
@Tree('materialized-path')
@Unique(['slug'])
export class Category extends TreeBase {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional()
  @IsString()
  @Column()
  slug: string;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  thumbnail: string;

  /**
   * Relations
   */
  @ApiProperty({ readOnly: true, writeOnly: true })
  @OneToMany((type) => Product, (product) => product.category, { eager: false })
  products: Product[];
}
