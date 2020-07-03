import * as Config from "config";

export const bcryptConfig = {
  saltRounds:
    parseInt(process.env.SALT_ROUNDS, 10) || Config.get("bcrypt").saltRounds,
};
