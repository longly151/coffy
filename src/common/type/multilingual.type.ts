import { IsString } from 'class-validator';

export class Multilingual {
  @IsString()
  en: string;

  @IsString()
  vi: string;

  static stringify(){
    return JSON.stringify({ en: 'string', vi: 'string' });
  }
}
