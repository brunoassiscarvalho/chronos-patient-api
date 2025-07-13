import { Request, Response } from "express";
import { Types } from "mongoose";
import BusinessException from "../../exceptions/BusinessException";
import Appointment, { IAppointment } from "./appointment";
import AppointmentNotificattions from "./appointment.notifications";

export default class AppointmentController {
  private readonly notifications: AppointmentNotificattions;

  constructor() {
    this.notifications = new AppointmentNotificattions();
  }
  public async getAppointments(): Promise<string> {
    return "Servidor Funcionado!";
  }

  public async getAppointment(
    req: Request,
    res: Response
  ): Promise<IAppointment> {
    const { appointmentId } = req.params;
    const { userId } = res.locals;
    try {
      return await Appointment.findOne({
        _id: appointmentId,
        "patient._id": userId,
      }).lean();
    } catch (error) {
      throw new BusinessException(
        "Não foi possível encontrar os agendamentos",
        "APPOINTMENT_GET_ERROR",
        error
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
        end: { $gte: new Date() },
      })
        .sort({ start: 1 })
        .lean();
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
      throw new BusinessException(
        "Não foi possível encontrar os agendamentos",
        "APPTMN003",
        error
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
      start: { $gte: new Date() },
      $or: [{ "patient._id": userId }, { patient: { $exists: false } }],
    }).lean();
  }

  public async patchPatientBookAppointment(
    req: Request,
    res: Response
  ): Promise<IAppointment> {
    const { _id } = req.body;
    const { name, picture, userId, email } = res.locals;
    let appointment = null;
    try {
      appointment = await Appointment.findOneAndUpdate(
        { _id, patient: { $exists: false }, start: { $gte: new Date() } },
        { patient: { name, picture, _id: userId, email } },
        { new: true }
      ).lean();
    } catch (error) {
      throw new BusinessException(
        "Não foi possivel agendar seu horário",
        "APPOINTMENT_BOOK_ERROR",
        error
      );
    }
    if (!appointment)
      throw new BusinessException(
        "Não foi possivel agendar seu horário",
        "APPOINTMENT_BOOK_ERROR_NOT_FOUND"
      );

    this.notifications.sendBookAppointmentMail(appointment);

    return appointment;
  }

  public async patchPatientCancelAppointment(
    req: Request,
    res: Response
  ): Promise<IAppointment> {
    const { _id } = req.body;
    const { userId } = res.locals;

    let appointment = null;
    try {
      appointment = await Appointment.findOneAndUpdate(
        { _id, "patient._id": userId, start: { $gte: new Date() } },
        { $unset: { patient: 1 } },
        { new: true }
      ).lean();
    } catch (error) {
      throw new BusinessException(
        "Não foi possivel cancelar seu horário",
        "APPOINTMENT_CANCEL_ERROR",
        error
      );
    }

    if (!appointment)
      throw new BusinessException(
        "Não foi possivel cancelar seu horário",
        "APPOINTMENT_CANCEL_ERROR_NOT_FOUND"
      );

    this.notifications.sendCancelAppointmentMail(appointment);

    return appointment;
  }
}
