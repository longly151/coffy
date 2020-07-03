import { EntityRepository } from "typeorm";
import { BaseRepository } from "@src/app/Common/Base/Repository/index.repository";
import { Credential } from "../credential.entity";

@EntityRepository(Credential)
export class CredentialRepository extends BaseRepository<Credential> {}
