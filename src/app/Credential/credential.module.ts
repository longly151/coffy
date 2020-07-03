import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CredentialController } from "./Controller/index.controller";
import { CredentialService } from "./Service/index.service";
import { CredentialRepository } from "./Repository/index.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CredentialRepository])],
  controllers: [CredentialController],
  providers: [CredentialService],
  exports: [CredentialService],
})
export class CredentialModule {}
