import { nameButtons } from "../../utils/constants";
import { IEvents } from "../base/events";
import { UserBase } from "./userBase";

export interface IOrder{
  paymentMethod:string|null;
  inputValues:Record<string,string>;
  messageValidation:string|null;
}

export type TButtons='elementButtonCash'|'elementButtonCard';

export class Order extends UserBase{
  protected elementButton: HTMLButtonElement;
  protected elementButtonCard: HTMLButtonElement;
  protected elementButtonCash: HTMLButtonElement;
  protected elementsButtons: NodeListOf<HTMLButtonElement>;
  
  constructor(container:HTMLElement, events:IEvents){
    super(container,events)
    this.elementButton=this.container.querySelector('.order__button') as HTMLButtonElement;
    
    this.container.addEventListener('submit',(evt)=>{
      evt.preventDefault();
      this.events.emit('Order:submit');
    })

    this.elementsButtons=this.container.querySelectorAll('.button_alt');
   
    nameButtons.forEach(name=>{
      this[<TButtons>(`elementButton${name}`)]=this.container.querySelector(`[name=${name.toLowerCase()}]`) as HTMLButtonElement;
      this[<TButtons>(`elementButton${name}`)].addEventListener('click',(evt)=>{
        evt.preventDefault();
       this.events.emit('Order-paymentMethod:click',{name:`${name.toLowerCase()}`});
      });
    })
  }

  set paymentMethod(value:string|null){
    if (!value) {
      this.elementsButtons.forEach(button=>{
        button.classList.remove('button_alt-active');
      })
      return;
    };
    
    this.elementsButtons.forEach(button=>{
      if (button.name===value) {
        button.classList.add('button_alt-active');
      }else{
        button.classList.remove('button_alt-active');
      }
    })
  }
}