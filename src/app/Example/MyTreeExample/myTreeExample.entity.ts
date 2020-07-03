import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeParent,
  TreeChildren,
  Tree,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEmpty,
  IsIn,
} from "class-validator";
import { CrudValidationGroups } from "@nestjsx/crud";
import { PostStatus } from "../../../common/enums/postStatus.enum";
import { enumToArray } from "../../../core/utils/helper";
import { TreeBase } from "../../Common/TreeBase/treeBase.entity";

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity("my_tree_examples")
@Tree("materialized-path")
export class MyTreeExample extends TreeBase {
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
  parentItem: MyTreeExample;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsEmpty()
  @TreeChildren({ cascade: true })
  childrenItems: MyTreeExample[];
}
