import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetail, ROUTE_PRODUCT_LIST_PREFIX } from '@Data/products';

export type ProductCompact = {
  code: string;
  name: string;
  url: string;
  imageUrl: string;
  minPrice?: number;
  maxPrice?: number;
  edition: string;
  quantity: number;
};

export const convertProductDetailToProductCompact = (
  rawProduct: ProductDetail,
  edition: string,
  quantity = 1,
): ProductCompact => ({
  code: rawProduct.productDetailSlug,
  name: rawProduct.name,
  url: `${ROUTE_PRODUCT_LIST_PREFIX}/${rawProduct.productDetailSlug}`,
  imageUrl: rawProduct.images[0],
  minPrice: rawProduct.minPrice,
  maxPrice: rawProduct.maxPrice,
  edition: edition,
  quantity: quantity,
});

export type CartState = {
  products: ProductCompact[];
};

const initialState: CartState = {
  products: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{ product: ProductCompact }>) => {
      const { product } = action.payload;
      const existenceProduct = state.products.find((x) => x.code === product.code && x.edition === product.edition);
      const newProducts = existenceProduct
        ? [
            ...state.products.filter((x) => !(x.code === product.code && x.edition === product.edition)),
            { ...product, quantity: existenceProduct.quantity + product.quantity },
          ]
        : [...state.products, product];
      return { ...state, products: newProducts };
    },
    reduce: (state, action: PayloadAction<{ product: ProductCompact }>) => {
      const { product } = action.payload;
      const existenceProduct = state.products.find((x) => x.code === product.code && x.edition === product.edition);
      if (existenceProduct) {
        const newProducts =
          existenceProduct.quantity <= product.quantity
            ? state.products.filter((x) => !(x.code === product.code && x.edition === product.edition))
            : [
                ...state.products.filter((x) => !(x.code === product.code && x.edition === product.edition)),
                { ...product, quantity: existenceProduct.quantity - product.quantity },
              ];
        return { ...state, products: newProducts };
      } else {
        return state;
      }
    },
    remove: (state, action: PayloadAction<{ productCode: string; edition: string }>) => ({
      ...state,
      products: state.products.filter(
        (x) => !(x.code === action.payload.productCode && x.edition === action.payload.edition),
      ),
    }),
    setQuantity: (state, action: PayloadAction<{ productCode: string; edition: string; quantity: number }>) => {
      const { productCode, edition, quantity } = action.payload;
      const existenceProduct = state.products.find((x) => x.code === productCode && x.edition === edition);
      if (existenceProduct) {
        const newProducts = [
          ...state.products.filter((x) => !(x.code === productCode && x.edition === edition)),
          { ...existenceProduct, quantity: quantity },
        ];
        return { ...state, products: newProducts };
      } else {
        return state;
      }
    },
    clear: (state) => ({ ...state, products: [] }),
  },
});

export const { add, reduce, remove, clear, setQuantity } = cartSlice.actions;
const { reducer: cartReducer } = cartSlice;

export default cartReducer;
