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
import { Post } from '../Post/index.entity';
import { enumToArray } from '../../core/utils/helper';
import { TreeBase } from '../Common/TreeBase/index.entity';
import { PostStatus } from '../../common/enums/postStatus.enum';

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
  description: string;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  content: string;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'This field is only used as an example'
  })
  @IsOptional()
  @IsIn(enumToArray(PostStatus))
  @Column({ default: 'ACTIVE' })
  status: string;

  /**
   * Self Relations
   */
  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsEmpty()
  @TreeParent()
  parentItem: Category;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsEmpty()
  @TreeChildren({ cascade: true })
  childrenItems: Category[];

  /**
   * Relations
   */
  @ApiProperty({ readOnly: true, writeOnly: true })
  @OneToMany((type) => Post, (post) => post.category, { eager: false })
  posts: Post[];
}
