import BusinessException from "../../exceptions/BusinessException";
import { Request, Response } from "express";
import Appointment, { IAppointment } from "./appointment";
import { Types } from "mongoose";

export default class AppointmentController {
  public async getAppointments(): Promise<string> {
    return "Servidor Funcionado!";
  }

  public async getAppointment(
    req: Request,
    res: Response
  ): Promise<IAppointment[]> {
    const { appointmentId } = req.params;
    const { userId } = res.locals;
    console.log({ userId });
    try {
      return await Appointment.find({
        _id: appointmentId,
        "patient._id": userId,
      }).lean();
    } catch (error) {
      throw new BusinessException(
        "Não foi possível encontrar os agendamentos",
        "APPTMN003"
      );
    }
  }

  public async getPatientAppointments(
    req: Request,
    res: Response
  ): Promise<IAppointment[]> {
    const { userId } = res.locals;
    try {
      return await Appointment.find({
        "patient._id": userId,
      }).lean();
    } catch (error) {
      throw new BusinessException(
        "Não foi possível encontrar os agendamentos",
        "APPTMN003"
      );
    }
  }

  public async getAvailableTime(
    req: Request,
    res: Response
  ): Promise<IAppointment[]> {
    const { professionalId }: { professionalId: Types.ObjectId } =
      req.params as any;
    const { userId } = res.locals;
    return Appointment.find({
      "professional._id": professionalId,
      $or: [{ "patient._id": userId }, { patient: { $exists: false } }],
    }).lean();
  }

  public async patchPatientAppointment(
    req: Request,
    res: Response
  ): Promise<IAppointment | null> {
    const { _id } = req.body;
    const { name, picture, userId, email } = res.locals;
    try {
      const appointment = await Appointment.findOneAndUpdate(
        { _id, patient: { $exists: false } },
        { patient: { name, picture, _id: userId, email } },
        { new: true }
      );
      if (!appointment)
        throw new BusinessException(
          "Não foi possivel agendar seu horário",
          "APPTMN001"
        );
      return appointment;
    } catch (error) {
      throw new BusinessException(
        "Não foi possivel agendar seu horário",
        "APPTMN002",
        error
      );
    }
  }
}
