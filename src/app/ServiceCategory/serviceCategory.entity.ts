import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  TreeParent,
  TreeChildren,
  TreeLevelColumn,
  Tree,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEmpty,
  IsInt,
  IsIn,
} from "class-validator";
import { CrudValidationGroups } from "@nestjsx/crud";
import { PostStatus } from "../../common/enums/postStatus.enum";
import { enumToArray } from "../../core/utils/helper";
import { TreeBase } from "../Common/TreeBase/treeBase.entity";

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity("service_categories")
@Tree("materialized-path")
export class ServiceCategory extends TreeBase {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "My Example",
    description: "This field is only used as an example",
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({
    example: "My Example",
    description: "This field is only used as an example",
  })
  @IsOptional()
  @IsString()
  @Column()
  slug: string;

  @ApiProperty({
    example: "My Example",
    description: "This field is only used as an example",
  })
  @IsOptional()
  @IsString()
  @Column()
  description: string;

  @ApiProperty({
    example: "My Example",
    description: "This field is only used as an example",
  })
  @IsOptional()
  @IsString()
  @Column()
  content: string;

  @ApiProperty({
    example: "My Example",
    description: "This field is only used as an example",
  })
  @IsOptional()
  @IsString()
  @Column()
  thumbnail: string;

  @ApiProperty({
    example: "My Example",
    description: "This field is only used as an example",
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsIn(enumToArray(PostStatus))
  @Column()
  status: string;

  /**
   * Relations
   */
  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsEmpty()
  @TreeParent()
  parentItem: ServiceCategory;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsEmpty()
  @TreeChildren({ cascade: true })
  childrenItems: ServiceCategory[];
}
