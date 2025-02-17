export abstract class ViewBaseComponent<T>{
  constructor (protected container:HTMLElement){
  }

  set replaceElementsInContainer(data:HTMLElement[]){
    this.container.replaceChildren(...data);
  }

  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }

  getContainer(){
    return this.container;
  }
}