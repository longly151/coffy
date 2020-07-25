import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsInt } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Base } from '../Common/Base/index.entity';
import { Product } from '../Product/index.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('bills')
export class Bill extends Base {
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
  customerName: string;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  phone: string;

  @ApiProperty({
    example: 'My Example',
    description: 'This field is only used as an example'
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  note: string;

  @ApiProperty({ example: 20000 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  subTotal: number;

  @ApiProperty({ example: 10000 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  shippingFee: number;

  /**
   * Relations
   */

  @ApiProperty({ readOnly: true })
  @ManyToMany((type) => Product, (product) => product.bills, {
    cascade: true,
    eager: true
  })
  @JoinTable({
    name: 'bill_products',
    joinColumn: {
      name: 'billId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id'
    }
  })
  products: Product[];
}
