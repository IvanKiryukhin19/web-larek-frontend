import { IBasketData, ICard } from "../../types";
import { IEvents } from "../base/events";

export class ModelBasket implements IBasketData{
  protected cards:ICard[];
  protected events:IEvents;

  constructor(events:IEvents){
    this.events=events;
  }

  setCards(cards:ICard[]): void {
    this.cards=cards;
    this.events.emit('ModelBasket:changed');
  }

  getCards(): ICard[] {
    return this.cards;
  }

  getOneCard(cardId: string): ICard {
    return this.cards.find(card => card.id === cardId) as ICard;
  }

  addOneCard(card: ICard): void {
    this.cards = [card, ...this.cards];
    this.events.emit('ModelBasket:changed');
  }

  removeOneCard(cardId: string): void {
    this.cards=this.cards.filter(card=>card.id!==cardId);
    this.events.emit('ModelBasket:changed');
  }

  getCountCards(): number {
    return this.cards.length;
  }

  getSumCards(): number {
    return this.cards.reduce(function(currentSum,card) {
      return currentSum+=card.price;
    },0);
  }
}