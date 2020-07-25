/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
import { Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsInt, IsIn } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import _ from 'lodash';
import { createSlug, createSlugWithDateTime, enumToArray } from '../../core/utils/helper';
import { Base } from '../Common/Base/index.entity';
import { Category } from '../Category/index.entity';
import { Bill } from '../Bill/index.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('products')
@Unique(['slug'])
export class Product extends Base {
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
  title: string;

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

  /**
   * Trigger
   */
  @BeforeInsert()
  async slugifyInsert() {
    if(!this.slug){
      if (_.has(this, 'title')) this.slug = createSlugWithDateTime(this['title']);
      if (_.has(this, 'name')) this.slug = createSlug(this['name']);
    }
  }

  @BeforeUpdate()
  async slugifyUpdate() {
    const repository = await Product.getRepository();
    const dbObject = await repository.findOne(this.id);
    if (this.slug && this.slug === dbObject.slug) {
      const dbName = dbObject['title'] || dbObject['name'];
      const dbSlug = dbObject.slug;
      const thisName = this['title'] || this['name'];

      if (thisName !== dbName) {
        // check if slug is created automatically
        if (_.includes(dbSlug, createSlug(dbName))) {
          if (_.has(this, 'title')) this.slug = createSlugWithDateTime(this['title']);
          if (_.has(this, 'name')) this.slug = createSlug(this['name']);
        }
      }
    }
  }

  /**
   * Relations
   */
  @ApiProperty({ readOnly: true })
  @ManyToOne((type) => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  categoryId: number;

  @ApiProperty({ readOnly: true })
  @ManyToMany((type) => Bill, (bill) => bill.products)
  bills: Bill[];
}
