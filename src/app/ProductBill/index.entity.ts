import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsInt } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Product } from '../Product/index.entity';
import { Base } from '../Common/Base/index.entity';
import { Bill } from '../Bill/index.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('product_bills')
export class ProductBill extends Base {

  @PrimaryColumn()
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  billId: number;

  @ManyToOne(() => Bill, bill => bill.productBills, { primary: true })
  bill: Bill;

  @PrimaryColumn()
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  productId: number;

  @ManyToOne(() => Product, product => product.productBills, { primary: true, eager: true })
  product: Product;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  quantity: number;

  @ApiProperty({ example: 20000 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  pricePerUnit: number;

  /**
   * Relations
   */
}
