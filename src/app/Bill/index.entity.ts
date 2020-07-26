import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsInt, Min, IsNumber, Validate, IsEmpty } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BillStatus } from '../../common/enums/billStatus.enum';
import { IsBillDetails } from '../../common/validation/isBillDetails.validation';
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

  @ApiProperty({ example: 20000, readOnly: true })
  @IsEmpty()
  @Column({ default: 0 })
  subTotal: number;

  @ApiProperty({ example: 10000 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ default: 0 })
  shippingFee: number;


  @ApiProperty({
    example: 'DONE',
    description: 'This field is only used as an example',
    readOnly: true
  })
  @IsEmpty()
  @Column({ default: BillStatus.DONE })
  status: string;

  /**
   * Relations
   */
  @ApiProperty({ readOnly: true })
  @OneToMany(() => ProductBill, productBill => productBill.bill, { eager: true })
    productBills: ProductBill[];

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiProperty({
    writeOnly: true,
    example: [
      {
        productId: 1,
        quantity: 2
      },
      {
        productId: 2,
        quantity: 1
      }],
    description: 'This field is only used as an example'
  })
  @Validate(IsBillDetails)
  details: Array<BillDetail>
}
