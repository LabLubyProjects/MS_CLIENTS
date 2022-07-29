import * as crypto from "crypto";

export default class Address {
  constructor(
    public id: string = crypto.randomUUID(),
    public city: string,
    public state: string,
    public zipcode: string
  ) {}
}
