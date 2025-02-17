import { IEvents } from "../base/events";
import { CATEGORY_STYLE, CDN_URL } from "../../utils/constants";
import { BaseCard } from "./Card";

export class CardCatalog extends BaseCard{
  protected elementCategory: HTMLElement;
  protected elementImage: HTMLElement;
  
  constructor(container:HTMLElement, events:IEvents){
    super(container, events)
    
    this.elementCategory=this.container.querySelector('.card__category') as HTMLElement;
    this.elementImage=this.container.querySelector('.card__image') as HTMLElement;
    this.container.addEventListener('click',()=>this.events.emit('CardCatalog:click',{card:this}));
  }

  set category(value:string){
    this.elementCategory.textContent=value;
    this.elementCategory.classList.add(`card__category_${CATEGORY_STYLE[value]}`);
  }

  set image(value:string){
    this.elementImage.setAttribute('src',`${CDN_URL}${value}`);
  }
}