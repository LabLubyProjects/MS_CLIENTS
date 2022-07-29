import * as crypto from "crypto";

export enum ClientStatus {
  PENDING,
  APPROVED,
  DISAPPROVED,
}

export interface ClientRepository {
  store(client: Client): Promise<Client>;
  index(): Promise<Client[]>;
}

export default class Client {
  constructor(
    public id: string = crypto.randomUUID(),
    public fullName: string,
    public cpfNumber: string,
    public currentBalance: number,
    public phone: string,
    public email: string,
    public averageSalary: number,
    public status?: ClientStatus
  ) {
    this.canBeApproved();
  }

  public canBeApproved() {
    this.status =
      this.averageSalary >= 500
        ? ClientStatus.APPROVED
        : ClientStatus.DISAPPROVED;
  }
}
