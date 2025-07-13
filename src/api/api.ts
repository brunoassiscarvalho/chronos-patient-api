import { Application } from "express";
import { LoginApi } from "./login/login.api";

// import { InfoApi } from "./info/info.api";
import { PatientApi } from "./patient/patient.api";
import { AppointmentApi } from "./appointment/appointment.api";
import { ProfessionalApi } from "./professional/professional.api";
import { VideoApi } from "./video/video.api";
import { SymptomApi } from "./symptom/symptom.api";
import { PatientSymptomApi } from "./patientSymptom/patientSymptom.api";

export class Routes {
  private loginApi: LoginApi;
  // private infoApi: InfoApi;
  private patientApi: PatientApi;
  private professionalApi: ProfessionalApi;
  private appointmentApi: AppointmentApi;
  private videoApi: VideoApi;
  private symptomApi: SymptomApi;
  private patientSymptom: PatientSymptomApi;

  constructor() {
    this.loginApi = new LoginApi();
    // this.infoApi = new InfoApi();
    this.patientApi = new PatientApi();
    this.professionalApi = new ProfessionalApi();
    this.appointmentApi = new AppointmentApi();
    this.videoApi = new VideoApi();
    this.symptomApi = new SymptomApi();
    this.patientSymptom = new PatientSymptomApi();
  }

  public routes(app: Application): void {
    this.loginApi.routes(app);
    // this.infoApi.routes(app);
    this.patientApi.routes(app);
    this.professionalApi.routes(app);
    this.appointmentApi.routes(app);
    this.videoApi.routes(app);
    this.symptomApi.routes(app);
    this.patientSymptom.routes(app);
  }
}
