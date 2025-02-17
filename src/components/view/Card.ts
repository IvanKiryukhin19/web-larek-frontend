import { ICard, IViewComponent } from "../../types";
import { IEvents } from "../base/events";
import { ViewBaseComponent } from "./viewBaseComponent";

export interface ICardHTML extends Omit<ICard,'price'>, IViewComponent{
  price: string;
  buttonElementTitle:string;
}

export abstract class BaseCard extends ViewBaseComponent<ICardHTML>{
  protected events:IEvents;
  protected elementTitle: HTMLElement;
  protected elementPrice: HTMLElement;
  protected cardId: string;

  constructor(container:HTMLElement, events:IEvents){
    super(container)
    this.events=events;

    this.elementTitle=this.container.querySelector('.card__title') as HTMLElement;
    this.elementPrice=this.container.querySelector('.card__price')as HTMLElement;
  }

  set title(value:string){
    this.elementTitle.textContent=value;
  }
  
  set price(value:string|null){
    this.elementPrice.textContent=value;
  }

  set id(value:string){
    this.cardId=value;
  }

  get id(){
    return this.cardId;
  }
}