export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number|null;
}

export interface IUser {
  email: string;
  phone: string;
  address: string;
}

export interface ICards {
  setCards(cards:ICard[]):void;
  getCards():ICard[];
  getOneCard(cardId:string):ICard;
}

export interface ICardsData extends ICards {
  getPreview():string|null;
  setPreview(cardId:string|null):void;
}

export interface IBasketData extends ICards{
  addOneCard(card:ICard):void;
  removeOneCard(cardId:string):void;
  getCountCards():number;
  getSumCards():number;
}

export type TOptionsInfo='address'|'email'|'phone';
export type TOptionPayment='card'|'cash';

export interface IUserData{
  setUserInfo(info:TOptionsInfo, value:string|null):void;
  setUserBlankInfo():void;
  getUserInfo(info:TOptionsInfo):string|null;
  setPayment(method:TOptionPayment|null):void;
  getPayment():string|null;
  getMessageValidationOrder():string;
  getMessageValidationContacts():string;
}

export interface IApiResponseData{
  total:number;
  items:ICard[];
  id:string;
}

export interface IViewComponent{
  replaceElementsInContainer:HTMLElement[];
}