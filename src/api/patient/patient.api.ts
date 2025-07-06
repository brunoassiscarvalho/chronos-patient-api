import { Request, Response, NextFunction, Application } from "express";
import { isAuthenticated } from "../../middleware/authenticated";
import PatientController from "./patient.controller";

export class PatientApi {
  private readonly defaultPath = "/patient";

  public patientController: PatientController = new PatientController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .getPatients()
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      }
    );

    app.post(
      this.defaultPath,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .createPatient(req)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      }
    );

    app.post(
      this.defaultPath + "/verification-mail",
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .sendVerificationEmail(req)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      }
    );
  }
}
