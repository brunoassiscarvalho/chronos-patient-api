import EMailController, {
  IEmailAppointment,
} from '../../email/email.controller';
import BusinessException from '../../exceptions/BusinessException';
import { convertAppointmentToEmailAppointment } from '../../util/Converters';
import { IAppointment } from './appointment';

interface IMessages {
  subject: string;
  userMessage: string;
  primaryMessage: string;
}

interface IAppointmentMessage extends IMessages {
  appointment: IEmailAppointment;
  to: { name: string; email: string };
}

export default class AppointmentNotificattions {
  private mailController: EMailController;

  constructor() {
    this.mailController = new EMailController();
  }

  public async sendBookAppointmentMail(
    appointment: IAppointment,
  ): Promise<any> {
    try {
      const [patientMail, professionalMail] = await Promise.all([
        this.sendPatientMail(appointment, {
          subject: 'Agendamento de Consulta',
          userMessage: 'Sua consulta foi agendada',
          primaryMessage: 'Segue informações:',
        }),
        this.sendProfessionalMail(appointment, {
          subject: 'Agendamento de Consulta',
          userMessage: 'Sua consulta foi agendada',
          primaryMessage: 'Segue informações:',
        }),
      ]);
      return { patientMail, professionalMail };
    } catch (error) {
      console.log({ error });
    }
  }

  public async sendCancelAppointmentMail(
    appointment: IAppointment,
  ): Promise<any> {
    try {
      const [patientMail, professionalMail] = await Promise.all([
        this.sendPatientMail(appointment, {
          subject: 'Cancelamento de Consulta',
          userMessage: 'Sua consulta foi cancelada',
          primaryMessage: 'Segue informações:',
        }),
        this.sendProfessionalMail(appointment, {
          subject: 'Cancelamento de Consulta',
          userMessage: 'Sua consulta foi cancelada',
          primaryMessage: 'Segue informações:',
        }),
      ]);
      return { patientMail, professionalMail };
    } catch (error) {
      console.log({ error });
    }
  }

  private async sendProfessionalMail(
    appointment: IAppointment,
    message: IMessages,
  ): Promise<void> {
    const { professional, ...others } = appointment;

    return this.sendAppointmentMessage({
      ...message,
      appointment: convertAppointmentToEmailAppointment(others),
      to: professional,
    });
  }

  private async sendPatientMail(
    appointment: IAppointment,
    message: IMessages,
  ): Promise<void> {
    const { patient, ...others } = appointment;

    if (patient?.email) {
      return this.sendAppointmentMessage({
        ...message,
        appointment: convertAppointmentToEmailAppointment(others),

        to: patient,
      });
    }
    throw new BusinessException(
      'Dados do paciente incompletos',
      'APPOINTMENT_ERROR_PATIENT_MAIL',
    );
  }

  private async sendAppointmentMessage(
    message: IAppointmentMessage,
  ): Promise<void> {
    const { to, subject, userMessage, primaryMessage, appointment } = message;
    if (!to) return;
    return this.mailController.sendMail({
      to: to.email,
      subject,
      context: {
        userName: to.name,
        appointment: appointment,
        userMessage,
        primaryMessage,
      },
    });
  }
}
