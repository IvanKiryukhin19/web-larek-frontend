import { IEvents } from "../base/events";
import { UserBase } from "./userBase";

export class Contacts extends UserBase{
  protected elementButton: HTMLButtonElement;
  
  constructor(container:HTMLElement, events:IEvents){
    super(container,events)
    this.elementButton=this.container.querySelector('.button') as HTMLButtonElement;
    this.container.addEventListener('submit',(evt)=>{
      evt.preventDefault();
      this.events.emit('Contacts:submit');
    })
  }
}