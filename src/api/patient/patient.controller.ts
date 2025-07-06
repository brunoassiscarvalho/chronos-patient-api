import BusinessException from "../../exceptions/BusinessException";
import { Request } from "express";
import { auth } from "firebase-admin";
import { UserRecord } from "firebase-functions/v1/auth";
import EMailController from "../../email/email.controller";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { decodePassAuthorization } from "../../util/Utils";
import Patient, { IPatient } from "./patient";

export default class UsesrController {
  private mailController: EMailController;

  constructor() {
    this.mailController = new EMailController();
  }

  public async getPatients(): Promise<string> {
    return "Servidor Funcionado!";
  }

  public async createPatient(req: Request): Promise<any> {
    const { email, password } = decodePassAuthorization(req.headers);

    const { name, phone, cep } = req.body;
    if (!name || !phone || !cep || !email || !password)
      throw new BusinessException("Dados incompletos", "PATIENT001");

    // create new paciente on bd
    let patient: IPatient | null = null;

    try {
      patient = await Patient.create({
        email,
        name,
        phone,
        cep,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        const user = await auth().getUserByEmail(email);
        if (user)
          throw new BusinessException(
            "Você já esta cadastrado na nossa base",
            "PATIENT_ALREADY_EXISTS_BD1_BD2",
            err
          );
      }
    }
    if (!patient)
      throw new BusinessException("Cliente não cadastrado", "PATIENT_EERO_BD1");
    // create new user on firebase
    try {
      await auth().createUser({
        uid: patient.id,
        email,
        password,
        emailVerified: false,
      });
    } catch (err: any) {
      if (err?.errorInfo?.code === "auth/email-already-exists") {
        throw new BusinessException(
          "O cadastro já existe na base",
          "PATIENT_ALREADY_EXISTS_BD2",
          err
        );
      }
      throw new BusinessException(
        "Não foi possível criar o cadastro de segurança",
        "PATIENT_REGISTER_ERROR_BD2",
        err
      );
    }

    try {
      await this.sendVerificationEmail(req);
    } catch (error) {
      throw new BusinessException(
        "Não foi possível enviar o email de confirmação",
        "PATIENT_EMAIL_ERROR_BD2",
        error
      );
    }
  }

  public async sendVerificationEmail(req: Request): Promise<string> {
    const { email, password } = decodePassAuthorization(req.headers);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      const patient: IPatient = await Patient.findOne({ email }).lean();
      const link: string = await auth().generateEmailVerificationLink(email, {
        url: req.get("origin") ?? "http://localhost:3000",
      });
      await this.mailController.sendVerificationEmail({
        userEmail: email,
        userName: patient.name,
        link,
      });
      return "deu certo";
    } catch (error) {
      throw new BusinessException(
        "Não foi possível enviar o email de confirmação",
        "PATIENT002",
        error
      );
    }
  }

  // public async resetPassword(req: Request): Promise<any> {
  //   const { email } = decodePassAuthorization(req.headers);

  //   getAuth().generatePasswordResetLink(email)
  //     .then(() => {
  //       // Password reset email sent!
  //       // ..
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // }
}
