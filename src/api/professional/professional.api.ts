import { Request, Response, NextFunction, Application } from "express";
import { isAuthenticated } from "../../middleware/authenticated";
import ProfessionalController from "./professional.controller";

export class ProfessionalApi {
  private defaultPath = "/professional";

  public professionalController: ProfessionalController =
    new ProfessionalController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.professionalController
          .getProfessionals()
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      }
    );
  }
}
