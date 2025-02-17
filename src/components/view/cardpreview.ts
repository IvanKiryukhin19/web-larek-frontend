import { IEvents } from "../base/events";
import { CardCatalog } from "./cardcatalog";

export class CardPreview extends CardCatalog{
  protected buttonBasket:HTMLButtonElement;
  protected elementDescription: HTMLElement;
  
  constructor(container:HTMLElement, events:IEvents){
    super(container,events)
    
    this.buttonBasket=this.container.querySelector('.card__button') as HTMLButtonElement;
    this.elementDescription=this.container.querySelector('.card__text') as HTMLElement;
    this.buttonBasket.addEventListener('click', ()=>this.events.emit('CardPreview-basket:click'));
  }

  set buttonElementTitle(title:string){
    this.buttonBasket.textContent=title;
  }

  set buttonElementDisabled(value:boolean){
    this.buttonBasket.disabled=value;
  }
}