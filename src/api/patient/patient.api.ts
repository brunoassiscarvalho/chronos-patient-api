import { Request, Response, NextFunction, Application } from 'express';
import { isAuthenticated } from '../../middleware/authenticated';
import PatientController from './patient.controller';
import multer from 'multer';

export class PatientApi {
  private defaultPath = '/patient';

  public patientController: PatientController = new PatientController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .getPatient(res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
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
      },
    );

    app.post(
      this.defaultPath + '/verification-mail',
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .sendVerificationEmail(req)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.patch(
      this.defaultPath + '/complement',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .updateComplementRegistration(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.patch(
      this.defaultPath + '/base',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .updateBaseRegistration(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.patch(
      this.defaultPath + '/image',
      isAuthenticated,
      multer().single('file'),
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .updateImage(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.post(
      this.defaultPath + '/email',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .requestChangeEmail(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.patch(
      this.defaultPath + '/email',
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .confirmChangeEmail(req)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.post(
      this.defaultPath + '/pass',
      async (req: Request, res: Response, next: NextFunction) => {
        this.patientController
          .sendResetPassEmail(req)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );
  }
}
