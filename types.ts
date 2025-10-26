
export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

export interface CartItem extends Product {
  quantity: number;
}
