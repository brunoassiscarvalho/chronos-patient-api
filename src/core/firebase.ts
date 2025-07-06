import { initializeApp } from "firebase/app";
import admin, { ServiceAccount } from "firebase-admin";
import Configurations from "./configurations";

export default function startFirebase(configurations: Configurations): void {
  admin.initializeApp({
    credential: admin.credential.cert(
      configurations.FIREBASE_ACCOUNT as ServiceAccount
    ),
    databaseURL: configurations.FIREBASE.databaseURL,
  });

  initializeApp(configurations.FIREBASE);
}
