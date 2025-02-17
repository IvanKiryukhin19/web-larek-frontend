import { IEvents } from "../base/events";
import { ICard, ICardsData } from "../../types";

export class ModelCardsData implements ICardsData{
  protected cards: ICard[];
  protected preview: string|null;
  protected events: IEvents;

  constructor(events:IEvents){
    this.events=events;
    this.preview=null;
  }

  setCards(cards: ICard[]):void{
    this.cards=cards;
    this.events.emit('ModelCardsData:loaded');
  }

  getCards(): ICard[] {
    return this.cards;
  }

  getOneCard(cardId: string):ICard{
    return this.cards.find(card => card.id === cardId) as ICard;
  }

  setPreview(cardId: string | null):void{
    if (!cardId) {
        this.preview = null;
        return;
    }
    const selectedCard = this.getOneCard(cardId);
    if (selectedCard) {
        this.preview = cardId;
        this.events.emit('ModelCardsData:selected')
    }
  } 

  getPreview ():string|null{
    return this.preview;
  }

}