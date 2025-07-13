import { Request, Response, NextFunction, Application } from 'express';
import { isAuthenticated } from '../../middleware/authenticated';
import SymptomController from './symptom.controller';

export class SymptomApi {
  private defaultPath = '/symptom';

  public symptomController: SymptomController = new SymptomController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.symptomController
          .getSymptoms()
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.get(
      this.defaultPath + '/:symptomId',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.symptomController
          .getSymptom(req)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );
  }
}
