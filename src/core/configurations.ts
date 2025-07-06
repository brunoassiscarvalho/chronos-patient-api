export default class Configurations {
  public APP: any;
  public FIREBASE;
  public EMAIL: any;
  public MONGO: string;
  public FIREBASE_ACCOUNT: any;
  public CLIENTS: Array<string>;
  public TWILLIO: any;

  constructor() {
    this.APP = {
      name: process.env.APP_NAME ?? "Defina um nome para a aplicação",
      logoUrl: process.env.APP_LOGO_URL,
    };
    this.FIREBASE = {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };

    this.EMAIL = { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS };
    this.MONGO = process.env.MONGO_DB_URI ?? "";

    this.FIREBASE_ACCOUNT = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };
    this.CLIENTS = process.env.CLIENTS?.split(" ") || [""];

    this.TWILLIO = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      keySid: process.env.TWILIO_API_KEY,
      secret: process.env.TWILIO_API_SECRET,
    };
  }
}
