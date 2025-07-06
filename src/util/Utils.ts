import { IncomingHttpHeaders } from "http";
import UnauthorizedException from "../exceptions/UnauthorizedException";

export function decodePassAuthorization(header: IncomingHttpHeaders): any {
  const codedCredential = header["x-factor"] as string;
  if (!codedCredential)
    throw new UnauthorizedException("Autorização não encontrada", "PASS001");

  if (!codedCredential.startsWith("Basic"))
    throw new UnauthorizedException(
      "Autorização básica não preenche os requisitos",
      "PASS002"
    );

  const [, token] = codedCredential.split(" ");
  const data = Buffer.from(token, "base64").toString("ascii");
  const [email, password] = data.split(":");
  return { email, password };
}
