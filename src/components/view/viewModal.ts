import { IViewComponent } from "../../types";
import { IEvents } from "../base/events";
import { ViewBaseComponent } from "./viewBaseComponent";

export interface IModal extends IViewComponent {
  open:void;
  close:void;
}

export class Modal extends ViewBaseComponent<IModal>{
  protected events:IEvents;
  protected mainModalWindow:HTMLElement;

  constructor(container:HTMLElement,events:IEvents){
    super(container);
    this.events=events;
    
    const parentContainer=this.container.parentElement as HTMLElement;
    this.mainModalWindow=parentContainer.parentElement as HTMLElement;
    const buttonCloseModal=parentContainer.querySelector('.modal__close') as HTMLButtonElement;
    buttonCloseModal.addEventListener('click',()=>{this.close()});
    this.mainModalWindow.addEventListener('click', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
  }

  open(){
    this.mainModalWindow.classList.add('modal_active');
  }

  close(){
    this.mainModalWindow.classList.remove('modal_active');
  }
}