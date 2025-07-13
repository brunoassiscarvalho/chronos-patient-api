import { IAppointment } from '../api/appointment/appointment';
import { IEmailAppointment } from '../email/email.controller';
import { literalPosition } from '../enums/EnumPositions';
import { getOnlyTimeHmm } from './Dates';

type IConverter = Pick<IAppointment, 'start' | 'end' | 'patient'> & {
  professional?: IAppointment['professional'];
};

export const convertAppointmentToEmailAppointment = (
  appointment: IConverter,
): IEmailAppointment => {
  return {
    day: new Date(appointment?.start)?.toLocaleString('pt-BR', {
      dateStyle: 'long',
    }),
    startTime: getOnlyTimeHmm(appointment?.start),
    endTime: getOnlyTimeHmm(appointment?.end),
    ...(appointment.professional && {
      professional: {
        name: appointment.professional.name,
        position: literalPosition(appointment.professional.position),
      },
    }),
    ...(appointment.patient && {
      patient: {
        name: appointment.patient.name,
        email: appointment.patient.email,
      },
    }),
  };
};
