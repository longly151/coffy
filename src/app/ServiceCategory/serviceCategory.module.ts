import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceCategoryController } from "./Controller/index.controller";
import { ServiceCategoryService } from "./Service/index.service";
import { ServiceCategoryRepository } from "./Repository/index.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategoryRepository])],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
