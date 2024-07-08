import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './autenticationContext';
import { authGetAPI, AuthPostAPI, AuthPutAPI, PostAPI } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface ProductProps {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

interface TicketProps {
  ticketId: string;
  slotId: string;
  quantity: number;
  price: number;
  name: string;
}

interface customerCartProps {
  products: ProductProps[];
  tickets: TicketProps[];
  pixDiscount: number;
  discount: number;

  taxValue: number;
  total: number;
  installments: {
    installmentNumber: number;
    value: number;
  }[];
}

interface CartContextProps {
  cart: customerCartProps;
  customerCartId: string;
  cleanCart: () => void;
  isEditingCustomerCart: boolean;
  GetCustomerCartByUserId: () => void;
  // eslint-disable-next-line no-unused-vars
  add: (item: ProductProps[] | TicketProps[], type: string) => void;
}

const CartContext = createContext({} as CartContextProps);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { logged } = useAuth();
  const [cart, setCart] = useState<customerCartProps>({
    tickets: [],
    products: [],
    discount: 0,
    pixDiscount: 0,
    taxValue: 0,
    total: 0,
    installments: [],
  });
  const [customerCart, setCustomerCart] = useState<customerCartProps>({
    tickets: [],
    products: [],
    discount: 0,
    pixDiscount: 0,
    taxValue: 0,
    total: 0,
    installments: [],
  });
  const [customerCartId, setCustomerCartId] = useState('');
  const [isEditingCustomerCart, setIsEditingCustomerCart] = useState(false);

  async function CreateCustomerCart() {
    const newCustomerCart = await AuthPostAPI('/purchase/customer/cart', {
      products: cart.products,
      tickets: cart.tickets,
    });

    if (newCustomerCart.status === 200) {
      setCart(newCustomerCart.body.cart);
      setCustomerCart(newCustomerCart.body.cart);
      setCustomerCartId(newCustomerCart.body.cartId);
    } else {
      setCart({
        tickets: [],
        products: [],
        discount: 0,
        pixDiscount: 0,
        taxValue: 0,
        total: 0,
        installments: [],
      });
      setCustomerCart({
        tickets: [],
        products: [],
        discount: 0,
        pixDiscount: 0,
        taxValue: 0,
        total: 0,
        installments: [],
      });

      await AsyncStorage.removeItem('cart');
    }
  }

  async function CreateCart() {
    setIsEditingCustomerCart(true);
    const newCart = await PostAPI('/purchase/cart', {
      products: cart.products,
      tickets: cart.tickets,
    });

    if (newCart.status === 200) {
      setCart(newCart.body.cart);
      setCustomerCart(newCart.body.cart);
      setIsEditingCustomerCart(false);
    }
    if (newCart.status !== 200) {
      Alert.alert(newCart.body.message);
      setCart(customerCart);
      await AsyncStorage.setItem('cart', JSON.stringify(customerCart));
      return setIsEditingCustomerCart(false);
    }
  }

  async function GetCustomerCartByUserId() {
    const customerCart = await authGetAPI(`/purchase/cart`);

    if (
      customerCart.status !== 200 ||
      JSON.stringify(customerCart.body.cart) !== JSON.stringify(customerCart)
    ) {
      return CreateCustomerCart();
    }
    if (customerCart.status === 200) {
      setCart(customerCart.body.cart);
      setCustomerCartId(customerCart.body.cartId);
      return setCustomerCart(customerCart.body.cart);
    }
  }

  useEffect(() => {
    const fetchCart = async () => {
      if (logged) {
        GetCustomerCartByUserId();
      } else {
        try {
          const cart = await AsyncStorage.getItem('cart');
          if (cart) {
            setCart(JSON.parse(cart));
          }
        } catch (error) {
          console.error('Failed to load the cart from storage', error);
        }
      }
    };

    fetchCart();
  }, [logged]);

  async function EditCustomerCart() {
    setIsEditingCustomerCart(true);
    const editCustomerCart = await AuthPutAPI(`/purchase/customer/cart/${customerCartId}`, {
      products: cart.products,
      tickets: cart.tickets,
    });

    if (editCustomerCart.status === 200) {
      setCart(editCustomerCart.body.cart);
      setCustomerCart(editCustomerCart.body.cart);
      return setIsEditingCustomerCart(false);
    }
    if (editCustomerCart.status === 409) {
      Alert.alert(editCustomerCart.body.message);
      await AsyncStorage.setItem('cart', JSON.stringify(customerCart));
      setCart(customerCart);
      return setIsEditingCustomerCart(false);
    }

    if (editCustomerCart.status !== 200 && editCustomerCart.status !== 409) {
      await AsyncStorage.setItem('cart', JSON.stringify(customerCart));
      setCart(customerCart);
      return setIsEditingCustomerCart(false);
    }
  }

  useEffect(() => {
    if (JSON.stringify(customerCart) !== JSON.stringify(cart) && logged && customerCartId) {
      EditCustomerCart();
    }

    if (JSON.stringify(customerCart) !== JSON.stringify(cart) && !logged) {
      CreateCart();
    }
  }, [cart]);

  const cleanCart = () => {
    setCart({
      tickets: [],
      products: [],
      discount: 0,
      pixDiscount: 0,
      taxValue: 0,
      total: 0,
      installments: [],
    });
    setCustomerCart({
      tickets: [],
      products: [],
      discount: 0,
      pixDiscount: 0,
      taxValue: 0,
      total: 0,
      installments: [],
    });
  };
  async function add(item: TicketProps[] | ProductProps[], type: string) {
    let newCart = cart;
    if (type === 'product') {
      newCart = {
        ...cart,
        tickets: cart.tickets,
        products: item as ProductProps[],
      };
    }
    if (type === 'ticket') {
      newCart = {
        ...cart,
        tickets: item as TicketProps[],
        products: cart.products,
      };
    }
    setCart(newCart);

    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Failed to save the cart to storage', error);
    }
  }
  const store = {
    add,
    cart,
    setCart,
    customerCartId,
    cleanCart,
    isEditingCustomerCart,
    GetCustomerCartByUserId,
  };

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  const { cart, add, customerCartId, isEditingCustomerCart, cleanCart, GetCustomerCartByUserId } =
    context;

  return {
    cart,
    cleanCart,
    add,
    customerCartId,
    isEditingCustomerCart,
    GetCustomerCartByUserId,
  };
}
