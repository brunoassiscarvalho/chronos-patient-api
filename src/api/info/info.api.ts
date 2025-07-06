import { Request, Response, NextFunction, Application } from "express";
import InfoController from "./info.controller";

export class InfoApi {
  private defaultPath = "/info";

  public infoController: InfoController = new InfoController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath,
      async (req: Request, res: Response, next: NextFunction) => {
        this.infoController
          .getInfos()
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      }
    );
  }
}
