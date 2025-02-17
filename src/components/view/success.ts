import { IEvents } from "../base/events";
import { ViewBaseComponent } from "./viewBaseComponent";

export interface ISuccess{
  price:string;
  success:HTMLElement;
}

export class Success extends ViewBaseComponent<ISuccess>{
  protected events:IEvents
  protected elementButton: HTMLButtonElement;
  protected elementDescription: HTMLElement;

  constructor(container:HTMLElement,events:IEvents){
    super(container)
    this.events=events
    
    this.elementButton=this.container.querySelector('.order-success__close') as HTMLButtonElement;
    this.elementDescription=this.container.querySelector('.order-success__description') as HTMLElement;
    this.elementButton.addEventListener('click',()=>{this.events.emit('Success:click')});
  }

  set price(value:string){
    this.elementDescription.textContent=value;
  }
}