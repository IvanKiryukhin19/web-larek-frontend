import { TOptionsInfo } from "../../types";
import { IEvents } from "../base/events";
import { IOrder} from "./order";
import { ViewBaseComponent } from "./viewBaseComponent";

export class UserBase extends ViewBaseComponent<IOrder>{
  protected events:IEvents;
  protected elementsInputs:NodeListOf<HTMLInputElement>;
  protected elementButton: HTMLButtonElement;
  protected elementError: HTMLElement;
 
  constructor(container:HTMLElement, events:IEvents){
    super(container)
    this.events=events;

    this.elementsInputs=this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.elementsInputs.forEach(input=>{
      input.addEventListener('input',(evt)=>{
        evt.preventDefault();
        const target=<HTMLButtonElement>evt.target;
        const name=target.name;
        const value=target.value;
        this.events.emit(`Order-${name}:input`,{name:name,value:value});
      })
    })

    this.elementError=this.container.querySelector('.form__errors') as HTMLElement;
  }

  set inputValues(data: Record<TOptionsInfo, string>) {
		this.elementsInputs.forEach((input) => {
			input.value = data[<TOptionsInfo>input.name];
		});
	}

  set messageValidation(value:string){
    this.elementError.textContent=value;
    this.elementButton.disabled=(value!=='');
  }
}