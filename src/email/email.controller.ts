import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

import Configurations from '../core/configurations';
import BusinessException from '../exceptions/BusinessException';

export interface IEmailAppointment {
  day: string;
  startTime: string;
  endTime: string;
  professional?: { name: string; position: string };
  patient?: { name: string; email: string };
}

interface IEmailTemplateContext {
  userName: string;
  userMessage: string;
  primaryMessage: string;
  secondaryMessage?: string;
  appointment?: IEmailAppointment;
  link?: string;
}

interface IEmailTemplate {
  to: string;
  subject: string;
  context: IEmailTemplateContext;
}

export default class EMailController {
  private configurations = new Configurations();

  private pathViews = './views/';
  private pathTemplates = path.resolve(__dirname, this.pathViews);
  private hbsConfig = {
    viewEngine: {
      extName: '.hbs',
      defaultLayout: '',
    },
    viewPath: this.configurations.EMAIL.path || this.pathTemplates,
    extName: '.hbs',
  };

  private transporter = createTransport({
    host: this.configurations.EMAIL.host,
    port: this.configurations.EMAIL.port,
    secure: true,
    auth: {
      user: this.configurations.EMAIL.user,
      pass: this.configurations.EMAIL.pass,
    },
  });

  public sendMail({ to, subject, context }: IEmailTemplate): any {
    const email = {
      from: `${this.configurations.APP.name} <${this.configurations.EMAIL.user}>`,
      to,
      subject: subject,
      template: 'mailTemplate',
      context: {
        ...context,
        logoUrl: this.configurations.APP.logoUrl,
        appDisplayName: this.configurations.APP.name,
      },
    };

    this.transporter.use('compile', hbs(this.hbsConfig));
    this.transporter.sendMail(email, (err, info) => {
      if (err) {
        throw new BusinessException(
          'não foi possível enviar o email',
          'MAIL_TRANSPORT_ERROR',
          err,
        );
      }
      return info;
    });
  }
}
