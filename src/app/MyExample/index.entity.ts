import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Base } from '../Common/Base/index.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('my_examples')
export class MyExample extends Base {
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

  /**
   * Relations
   */
}
