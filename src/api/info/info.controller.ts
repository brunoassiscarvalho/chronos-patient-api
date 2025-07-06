// const Contact = mongoose.model("Contact", ContactSchema);
export default class InfoController {
  public async getInfos(): Promise<string> {
    return "Servidor Funcionado!";
  }
}
