import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { API_URL, buttonPreviewTitle, CURRENCY, typeOptions } from './utils/constants';
import { ModelCardsData } from './components/model/modelCards';
import { IApiResponseData, IBasketData, ICard, IOrderPayload, IUserData, TOptionPayment, TOptionsInfo } from './types';
import { Page } from './components/view/page';
import { ModelBasket } from './components/model/modelBasket';
import { Modal } from './components/view/viewModal';
import { CardPreview } from './components/view/cardpreview';
import { CardBasket } from './components/view/cardbasket';
import { cloneTemplate } from './utils/utils';
import { BasketForModal } from './components/view/basket';
import { Order } from './components/view/order';
import { ModelUser } from './components/model/modelUser';
import { Contacts } from './components/view/contacts';
import { Success } from './components/view/success';
import { CardCatalog } from './components/view/cardcatalog';

const events = new EventEmitter();
const cardsData=new ModelCardsData(events);
const basket=new ModelBasket(events);
const user=new ModelUser(events);

const initCards = new Api(API_URL);

const pageContainer=document.querySelector('.gallery') as HTMLElement;
const page=new Page(pageContainer,events);
const cardContainerPreview=cloneTemplate('#card-preview');
const cardForModal=new CardPreview(cardContainerPreview,events);
const modalWindow=document.querySelector('#modal-container') as HTMLElement;
const modalContainer=modalWindow.querySelector('.modal__content') as HTMLElement;
const modal=new Modal(modalContainer,events);
const modalBasketClone=cloneTemplate('#basket');
const modalBasketContainer=modalBasketClone.querySelector('.basket__list') as HTMLElement;
const modalBasket=new BasketForModal(modalBasketContainer,events);
const modalOrderContainer=cloneTemplate('#order');
const modalOrder=new Order(modalOrderContainer,events);
const modalContactsContainer=cloneTemplate('#contacts');
const modalContacts=new Contacts(modalContactsContainer,events);
const modalSuccessContainer=cloneTemplate('#success');
const modalSuccess=new Success(modalSuccessContainer,events);

initCards.get('/product/')
  .then(data=>{
    return <IApiResponseData>data;
  })
  .then(data=>{
    cardsData.setCards(data.items);
  })
 .catch(error=>console.log(error));

events.on('ModelCardsData:loaded',()=>{
  cleaningUserData(basket,user);
  
  const cardsHTMLArray=cardsData.getCards().map(card=>{
    const cardCatalogContainer=cloneTemplate('#card-catalog');
    const cardForCatalog=new CardCatalog(cardCatalogContainer,events);
    return cardForCatalog.render({...card,...transformPrice(card.price)});
  })
  page.render({
    replaceElementsInContainer:cardsHTMLArray,
    basketOrderCount: basket.getCountCards()
  })

  //Пишем события при вводе двнных в инпуты форм
  typeOptions.forEach(name=>{
    events.on(`Order-${name}:input`,(data:{name:TOptionsInfo,value:string})=>{
    const {name,value}=data;
    user.setUserInfo(name,value);
    })
  })
})

//Событие - нажимаем на карточку. В модель данных ModelCards записывается Id карточки по которой кликнули
events.on('CardCatalog:click',(data:{card:CardCatalog})=>{
  const {card}=data;
  cardsData.setPreview(card.id);
})

//Если в модели данных меняется свойство Preview, то срабатывает событие - карточка для просмотра выбрана и её надо показать
events.on('ModelCardsData:selected',()=>{
  const cardId:string|null=cardsData.getPreview();
  if (cardId){
    const card=cardsData.getOneCard(cardId);
    const cardBasket=basket.getOneCard(cardId);
   
    let buttonOption:Record<string,string|boolean>
    if (cardBasket){
      buttonOption={buttonElementTitle:buttonPreviewTitle.fromBasket};

    }else{
      buttonOption={buttonElementTitle:buttonPreviewTitle.toBasket};
    }

    if (!card.price) {
      buttonOption={
        buttonElementTitle:buttonPreviewTitle.nullPrice,
      };
    }
    
    buttonOption=Object.assign(buttonOption,{buttonElementDisabled:!card.price})
    
    cardForModal.render(buttonOption);
    cardForModal.render({...card,...transformPrice(card.price)});

    modal.render({replaceElementsInContainer:[cardForModal.getContainer()]});
    modal.open();
  }else{
    console.log('Error - card not selected')
  }
});

//Eсли в модели данных ModelBasket происходит изменение добавление/удаление запускается событие
events.on('ModelBasket:changed',()=>{
  //рендерим счетчик на корзине
  page.render({
    basketOrderCount: basket.getCountCards(),
  })
  //перерисовываем карточки в корзине и рендерим модалку с корзиной
  const cardsBasketHTMLArray=basket.getCards().map((card,index)=>{
    const basketCardContainer=cloneTemplate('#card-basket');
    const basketCard=new CardBasket(basketCardContainer,events)
    basketCard.setCardIndex((++index).toString());
    return basketCard.render({...card,...transformPrice(card.price)});
  });
  modalBasket.render({
    replaceElementsInContainer:cardsBasketHTMLArray,
    sumBasket: formatPrice(basket.getSumCards()),
    isActive: basket.getSumCards()>0
  })
})

//Нажимает в модалке на кнопку добавить в корзину. "В корзину" меняем на "Удалить из корзины"
events.on('CardPreview-basket:click',()=>{
  const cardId=cardsData.getPreview() ?? '';
  //Если карточка в модели данных корзины уже есть, то происходит удаление из ModelBasket, если нет добавление и передаем в рендер новое название кнопки
  let buttonTitle:string;
  if(basket.getOneCard(cardId)){
    basket.removeOneCard(cardId);
    buttonTitle=buttonPreviewTitle.toBasket;
  }else{
    basket.addOneCard(cardsData.getOneCard(cardId));
    buttonTitle=buttonPreviewTitle.fromBasket;
  }

  cardForModal.render({
    buttonElementTitle:buttonTitle,
  })
})

//открываем корзину
events.on('Page-basket:click',()=>{
  //корзина уже была отрисована при добавлении/удалении товара - просто открываем модалку с корзиной
  modal.render({
    replaceElementsInContainer:[modalBasket.getContainer()],
  })
  modal.open();
})

//Удаляем товар из корзины по иконке. Событие вызывает удаление карточки из модели данных корзины. Изменение в модели данных корзины вызывает 'ModelBasket:changed'
events.on('CardBasket:delete',(data:{card:CardBasket})=>{
  const {card} = data;
  basket.removeOneCard(card.id);
})

//Событие при нажатии кнопки "Оформить"/////////////////////////////////////////////////////////////////////////////////
events.on('Basket-order:click',()=>{
  //Рендерим модалку с выбором формы оплаты и адресом
  modalOrder.render({
    messageValidation:user.getMessageValidationOrder(),
  })
  
  modal.render({
    replaceElementsInContainer:[modalOrder.getContainer()],
  })
  modal.open();
})

//Событие по нажатию на кнопку с выбором формы платежа. Записываем активированную кнопку в модел данных пользователя, изменение вызывает событие 'ModalUser:changed'
events.on('Order-paymentMethod:click',(data:{name:TOptionPayment})=>{
  const {name}=data;
  user.setPayment(name);
})

//При изменении данных в ModelUser происходит отрисовка карточки по новым данным
events.on('ModalUser:changed',()=>{
  const data:Record<TOptionsInfo,string>={
    address:user.getUserInfo('address') ?? '',
    email:user.getUserInfo('email') ?? '',
    phone:user.getUserInfo('phone') ?? ''
  }

  modalOrder.render({
    inputValues:data,
    messageValidation:user.getMessageValidationOrder(),
    paymentMethod: user.getPayment()
  })

  modalContacts.render({
    inputValues:data,
    messageValidation:user.getMessageValidationContacts(),
  })
})

//Событие если нажимаем оплатить
events.on('Order:submit',()=>{
  modalContacts.render({
    messageValidation:user.getMessageValidationContacts(),
  })
  modal.render({
    replaceElementsInContainer:[modalContacts.getContainer()],
  })
  modal.open();
})

//Событие при нажатии кнопки "Оплатить"
events.on('Contacts:submit',()=>{
  const bodyRequest:IOrderPayload={
    payment: <string>user.getPayment(),
    email: <TOptionsInfo>user.getUserInfo('email'),
    phone: <TOptionsInfo>user.getUserInfo('phone'),
    address: <TOptionsInfo>user.getUserInfo('address'),
    total: <number>basket.getSumCards(),
    items: <string[]>basket.getCards().map(card=>card.id)
  }

  const apiOrder=new Api(API_URL);
  apiOrder.post('/order',bodyRequest,'POST')
    .then(data=><IApiResponseData>data)
    .then(data=>{
      //обнуляем данные
      cleaningUserData(basket,user)
      //выводим сообщение об успешном заказе
      modalSuccess.price=`Списано ${formatPrice(data.total)}`;
      modal.render({
        replaceElementsInContainer:[modalSuccess.getContainer()],
      })
    })
    .catch(error=>console.log(`Заказ не оформлен. Ошибка - ${error}`))
})

events.on('Success:click',()=>{
  modal.close();
})

function transformPrice(price:number|null):{price:string}{
  if (!price) {
    return {price:''};
  }else{
    return {price:formatPrice(price)};
  }
}

function formatPrice(value:number):string{
  return `${value.toLocaleString('ru-RU')} ${CURRENCY}`
}

function cleaningUserData(basket:IBasketData,user:IUserData){
  basket.setCards([]);
  user.setPayment(null);
  user.setUserBlankInfo();
}