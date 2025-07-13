import { Request, Response, NextFunction, Application } from 'express';
import { isAuthenticated } from '../../middleware/authenticated';
import AppointmentController from './appointment.controller';

export class AppointmentApi {
  private defaultPath = '/appointment';

  public appointmentController: AppointmentController =
    new AppointmentController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath + '/:appointmentId',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.appointmentController
          .getAppointment(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.get(
      this.defaultPath,
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.appointmentController
          .getPatientAppointments(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.get(
      this.defaultPath + '/professional/:professionalId',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.appointmentController
          .getAvailableTime(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.post(
      this.defaultPath + '/patient',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.appointmentController
          .patchPatientBookAppointment(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.put(
      this.defaultPath + '/patient',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.appointmentController
          .patchPatientBookAppointment(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );

    app.delete(
      this.defaultPath + '/patient',
      isAuthenticated,
      async (req: Request, res: Response, next: NextFunction) => {
        this.appointmentController
          .patchPatientCancelAppointment(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      },
    );
  }
}
