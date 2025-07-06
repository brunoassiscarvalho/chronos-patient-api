import { Request, Response, NextFunction, Application } from "express";
import LoginController from "./login.controller";

export class LoginApi {
  private defaultPath = "/login";

  public authController: LoginController = new LoginController();

  public routes(app: Application): void {
    app.post(
      this.defaultPath,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          this.authController
            .login(req)
            .then((result) => {
              res.json(result);
              next();
            })
            .catch((e) => next(e));
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
