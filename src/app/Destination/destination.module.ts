import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DestinationController } from "./Controller/index.controller";
import { DestinationService } from "./Service/index.service";
import { DestinationRepository } from "./Repository/index.repository";

@Module({
  imports: [TypeOrmModule.forFeature([DestinationRepository])],
  controllers: [DestinationController],
  providers: [DestinationService],
  exports: [DestinationService],
})
export class DestinationModule {}
