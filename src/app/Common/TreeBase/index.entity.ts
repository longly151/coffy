import { IsOptional, IsInt } from 'class-validator';
import { Base } from '../Base/index.entity';

export abstract class TreeBase extends Base {
  @IsOptional()
  @IsInt()
  parentItemId: number;
}
