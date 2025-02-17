import { IViewComponent } from "../../types";
import { IEvents } from "../base/events";
import { ViewBaseComponent } from "./viewBaseComponent";

export interface IPage extends IViewComponent{
  basketOrderCount: number;
}

export class Page extends ViewBaseComponent<IPage>{
  protected events:IEvents;
  protected basketCount:HTMLElement;
  protected basket:HTMLButtonElement;
  
  constructor(container:HTMLElement, events:IEvents){
    super(container);
    this.events=events;
    this.basket=document.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCount=this.basket.querySelector('.header__basket-counter') as HTMLElement;
    this.basket.addEventListener('click',()=>this.events.emit('Page-basket:click'));
  }

  set basketOrderCount(value:number){
    this.basketCount.textContent=value.toString();
  }
}