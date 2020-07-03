import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  TreeParent,
  TreeChildren,
  Tree,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt } from "class-validator";
import { Base } from "../Base/base.entity";

export abstract class TreeBase extends Base {
  @IsOptional()
  @IsInt()
  parentId: number;
}
