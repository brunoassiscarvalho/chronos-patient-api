import { Request, Response, NextFunction, Application } from "express";
import VideoController from "./video.controller";

export class VideoApi {
  private defaultPath = "/video";

  public VideoController: VideoController = new VideoController();

  public routes(app: Application): void {
    app.get(
      this.defaultPath + "/:appointmentId",
      async (req: Request, res: Response, next: NextFunction) => {
        this.VideoController.getVideoToken(req, res)
          .then((result) => {
            res.json(result);
            next();
          })
          .catch((e) => next(e));
      }
    );
  }
}
