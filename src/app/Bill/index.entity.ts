import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsInt, Min, IsNumber, Validate } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsBillDetail } from '../../common/validation/isBillDetail.validation';
import { BillDetail } from '../../common/type/billDetail.type';
import { ProductBill } from '../ProductBill/index.entity';
import { Base } from '../Common/Base/index.entity';

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
  @OneToMany(() => ProductBill, productBill => productBill.bill, { eager: true })
    productBills: ProductBill[];

  @ApiProperty({
    writeOnly: true,
    example: {
      productId: 1,
      quantity: 2,
      pricePerUnit: 50000
    },
    description: 'This field is only used as an example'
  })
  @Validate(IsBillDetail)
  detail: BillDetail
}
