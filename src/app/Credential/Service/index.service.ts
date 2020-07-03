import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { CredentialRepository } from "../Repository/index.repository";
import { Credential } from "../credential.entity";

@Injectable()
export class CredentialService extends TypeOrmCrudService<Credential> {
  constructor(
    @InjectRepository(Credential) repo,
    private readonly credentialRepository: CredentialRepository
  ) {
    super(repo);
  }
}
