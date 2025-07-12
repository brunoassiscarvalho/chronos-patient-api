import { Request } from "express";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  UserCredential,
} from "firebase/auth";
import { auth } from "firebase-admin";
import UnauthorizedException from "../../exceptions/UnauthorizedException";
import { decodePassAuthorization } from "../../util/Utils";
import Patient, { IPatient } from "../patient/patient";

export default class LoginController {
  public async login(req: Request): Promise<any> {
    const { email, password } = decodePassAuthorization(req.headers);
    let userLogged: UserCredential;
    try {
      userLogged = await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (err) {
      throw new UnauthorizedException(
        "Não foi possível fazer o login",
        "LOGIN001",
        err
      );
    }
    // if (!userLogged.user?.emailVerified) {
    //   throw new UnauthorizedException(
    //     "O email ainda não foi validado",
    //     "LOGIN002"
    //   );
    // }

    let patient: IPatient | null;
    try {
      patient = await Patient.findOne({
        email: userLogged.user.email,
      });
    } catch (error) {
      throw new UnauthorizedException(
        "O email ainda não foi validado",
        "LOGIN004",
        error
      );
    }

    if (!patient)
      throw new UnauthorizedException("Cadastro não localizado", "LOGIN003");

    try {
      const customToken = await auth().createCustomToken(userLogged.user.uid, {
        userId: patient._id,
        email: patient.email,
        name: patient.name,
        role: patient.role,
      });

      userLogged = await signInWithCustomToken(getAuth(), customToken);
      const token = await userLogged.user.getIdToken();

      return {
        userId: patient._id,
        email: patient.email,
        name: patient.name,
        role: patient.role,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException(
        "Os dados não puderam ser validádos",
        "LOGIN005",
        error
      );
    }
  }
}
