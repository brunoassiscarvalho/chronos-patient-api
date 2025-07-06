// const Contact = mongoose.model("Contact", ContactSchema);

import { Response, Request } from "express";
import { jwt as TwillioJwt } from "twilio";
import Configurations from "../../core/configurations";
import BusinessException from "../../exceptions/BusinessException";

export default class VideoController {
  private configurations: Configurations;

  constructor() {
    this.configurations = new Configurations();
  }

  public async getVideos(): Promise<string> {
    return "Servidor Funcionado!";
  }

  public async getVideoToken(req: Request, res: Response): Promise<string> {
    const { appointmentId } = req.params;
    const { userId } = res.locals;

    const { accountSid, keySid, secret } = this.configurations.TWILLIO;
    if (!accountSid || !keySid || !secret)
      throw new BusinessException(
        "Dados de vídeo incorreto",
        "TWILLIO_VIDEO_TOKEN_ERRO"
      );

    const token = new TwillioJwt.AccessToken(accountSid, keySid, secret, {
      identity: userId,
    });

    const videoGrant = new TwillioJwt.AccessToken.VideoGrant({
      room: appointmentId,
    });
    token.addGrant(videoGrant);
    return token.toJwt();
  }
}
