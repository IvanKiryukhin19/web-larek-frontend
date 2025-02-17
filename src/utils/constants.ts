export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const CURRENCY='синапсов';
export const CATEGORY_STYLE:{[key:string]:string}={
  ["софт-скил"]:"soft",
  ["другое"]:"other",
  ["хард-скил"]:"hard",
  ["кнопка"]:"button",
  ["дополнительное"]:"additional"
  }

export const nameButtons:string[]=['Cash','Card'];
export const typeOptions:string[]=['address','email','phone'];

export const settings = {

};

export const buttonPreviewTitle:Record<string,string>={
  toBasket:'В корзину',
  fromBasket:'Удалить из корзины',
  nullPrice: 'Бесценна'
}

export const messageToUser:Record<string,string>={
  methodPayment:'Укажите способ оплаты',
  address:'Введите адрес',
  email: 'Введите email',
  phone: 'Укажите телефон',
}