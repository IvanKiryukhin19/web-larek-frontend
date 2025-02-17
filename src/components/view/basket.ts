import { IViewComponent } from "../../types";
import { IEvents } from "../base/events";
import { ViewBaseComponent } from "./viewBaseComponent";

export interface IBasket extends IViewComponent{
  button: HTMLButtonElement;
  elementList: HTMLElement;
  sumElement: HTMLElement;
  sumBasket:string;
  basket:HTMLElement;
  isActive:boolean;
}

export class BasketForModal extends ViewBaseComponent<IBasket>{
  protected events: IEvents;
  protected button: HTMLButtonElement;
  protected sumElement: HTMLElement;
  protected parentContainer: HTMLElement

  constructor(container:HTMLElement, events:IEvents){
    super(container);
    this.events=events;
    
    this.parentContainer=this.container.parentElement as HTMLElement;
    this.sumElement=this.parentContainer.querySelector('.basket__price') as HTMLElement;
    this.button=this.parentContainer.querySelector('.basket__button') as HTMLButtonElement;
    this.button.addEventListener('click',()=>this.events.emit('Basket-order:click'))
 }

  set sumBasket(value:string){
    this.sumElement.textContent=value;
  }

  set isActive(value:boolean){
    this.button.disabled=!value;
  }

  getContainer(){
    return this.parentContainer;
  }
}