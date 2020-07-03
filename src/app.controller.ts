import { Controller } from "@nestjs/common";
import { AuthService } from "@src/app/Auth/Service/index.service";
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
}
