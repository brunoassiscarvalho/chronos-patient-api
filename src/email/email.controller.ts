import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import Configurations from "../core/configurations";
import BusinessException from "../exceptions/BusinessException";

interface IVerificationEmail {
  userEmail: string;
  userName: string;
  link: string;
}

interface IMailTemplate {
  to: string;
  subject: string;
  template: string;
  context: any;
}

export default class EMailController {
  private configurations = new Configurations();

  private pathViews = "./views/";
  private pathTemplates = path.resolve(__dirname, this.pathViews);
  private hbsConfig = {
    viewEngine: {
      extName: ".hbs",
      defaultLayout: "",
    },
    viewPath: this.pathTemplates,
    extName: ".hbs",
  };

  private transporter = createTransport({
    service: "gmail",
    auth: {
      user: this.configurations.EMAIL.user,
      pass: this.configurations.EMAIL.pass,
    },
  });

  private sendMailTemplate({ to, subject, template, context }: IMailTemplate) {
    const email = {
      from: this.configurations.EMAIL.user,
      to,
      subject: this.configurations.APP.name + " - " + subject,
      template,
      context,
    };

    this.transporter.use("compile", hbs(this.hbsConfig));
    this.transporter.sendMail(email, (err, info) => {
      if (err) {
        throw new BusinessException(
          "não foi possível enviar o email",
          "MAILH001",
          err
        );
      }
      return info;
    });
  }

  public sendVerificationEmail({
    userEmail,
    userName,
    link,
  }: IVerificationEmail): void {
    console.log({
      user: this.configurations.EMAIL.user,
      pass: this.configurations.EMAIL.pass,
    });

    const appDisplayName = this.configurations.APP.name;
    return this.sendMailTemplate({
      to: userEmail,
      subject: `${appDisplayName} - sua conta foi criada com sucesso`,
      template: "welcomeMailConfirmation",
      context: {
        appDisplayName,
        userName,
        link,
        logoUrl: this.configurations.APP.logoUrl,
      },
    });
  }
}
