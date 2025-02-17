import { IEvents } from "../base/events";
import { BaseCard } from "./Card";

export class CardBasket extends BaseCard{
  protected elementCardIndex: HTMLElement;
  protected elementButtonDelete: HTMLButtonElement;

  constructor(container:HTMLElement,events:IEvents){
    super(container,events);

    this.elementCardIndex=this.container.querySelector('.basket__item-index') as HTMLElement;
    this.elementButtonDelete=this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this.elementButtonDelete.addEventListener('click',()=>{this.events.emit('CardBasket:delete',{card:this})});
  }

  setCardIndex(value:string){
    this.elementCardIndex.textContent=value;
  }
}