import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsInt } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Product } from '../Product/index.entity';
import { Base } from '../Common/Base/index.entity';
import { Bill } from '../Bill/index.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('product_bills')
export class ProductBill extends Base {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  billId: number;

  @ManyToOne(() => Bill, bill => bill.productBills)
  bill: Bill;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  productId: number;

  @ManyToOne(() => Product, product => product.productBills)
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
