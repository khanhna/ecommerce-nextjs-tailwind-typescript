import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart';
import navigatorReducer from './navigator';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const middlewareConfiguration = { serializableCheck: false };

const reducers = combineReducers({ cart: cartReducer });
const persistConfig = { key: 'root-state', storage };
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  devTools: {
    name: 'Ecom-dev-site',
  },
  reducer: { appPersist: persistedReducer, navigator: navigatorReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
