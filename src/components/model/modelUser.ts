import { TOptionsInfo, TOptionPayment, IUserData } from "../../types";
import { messageToUser, typeOptions } from "../../utils/constants";
import { IEvents } from "../base/events";

export class ModelUser implements IUserData{
  protected events:IEvents;
  protected methodPayment: TOptionPayment|null;
  protected address:string|null;
  protected email:string|null;
  protected phone:string|null;

  constructor(events:IEvents){
    this.events=events;
    this.methodPayment=null;
  }

  setUserInfo(info: TOptionsInfo, value: string|null): void {
    this[info]=value;
    this.events.emit('ModalUser:changed');
  }

  getUserInfo(info: TOptionsInfo): string|null {
    return this[info];
  }

  setUserBlankInfo():void{
    typeOptions.forEach(Info=>{
      this.setUserInfo(<TOptionsInfo>Info,null);
    })
  }

  getMessageValidationOrder(): string {
    const message:string[]=[];
    if (!this.getPayment()) message.push(messageToUser.methodPayment);
    if (!this['address']) message.push(messageToUser.address);
    return message.join(', ');
  }

  getMessageValidationContacts(): string {
    const message:string[]=[];
    if(!this['email']) message.push(messageToUser.email);
    if(!this['phone']) message.push(messageToUser.phone);
    return message.join(', ');
  }

  setPayment(method: TOptionPayment|null): void {
    this.methodPayment=method;
    this.events.emit('ModalUser:changed');
  }

  getPayment(): string | null {
    return this.methodPayment;
  }
}