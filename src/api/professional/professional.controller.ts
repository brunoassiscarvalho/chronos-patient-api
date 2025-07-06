import BusinessException from "../../exceptions/BusinessException";
import { Request } from "express";

import Professional, { IProfessional } from "./professional";

export default class UsesrController {
  public async getProfessionals(): Promise<IProfessional[]> {
    return Professional.find().lean();
  }
}
