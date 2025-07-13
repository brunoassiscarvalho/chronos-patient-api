import { Request, Response, NextFunction, Application } from 'express';
import { isAuthenticated } from '../../middleware/authenticated';
import PatientSymptomController from './patientSymptom.controller';

export class PatientSymptomApi {
  private defaultPath = '/patient-symptom';

  public patientSymptomController: PatientSymptomController =
    new PatientSymptomController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientSymptomController
          .getPatientSymptoms(res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.post(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientSymptomController
          .createPatientSymptom(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );
  }
}
