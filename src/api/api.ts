import { Application } from "express";
import { LoginApi } from "./login/login.api";

import { InfoApi } from "./info/info.api";
import { PatientApi } from "./patient/patient.api";
import { AppointmentApi } from "./appointment/appointment.api";
import { ProfessionalApi } from "./professional/professional.api";
import { VideoApi } from "./video/video.api";

export class Routes {
  private readonly loginApi: LoginApi;
  private readonly infoApi: InfoApi;
  private readonly patientApi: PatientApi;
  private readonly professionalApi: ProfessionalApi;
  private readonly appointmentApi: AppointmentApi;
  private readonly videoApi: VideoApi;

  constructor() {
    this.loginApi = new LoginApi();
    this.infoApi = new InfoApi();
    this.patientApi = new PatientApi();
    this.professionalApi = new ProfessionalApi();
    this.appointmentApi = new AppointmentApi();
    this.videoApi = new VideoApi();
  }

  public routes(app: Application): void {
    this.loginApi.routes(app);
    this.infoApi.routes(app);
    this.patientApi.routes(app);
    this.professionalApi.routes(app);
    this.appointmentApi.routes(app);
    this.videoApi.routes(app);
  }
}
