import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NavigatorState = {
  scrollDirection: 'up' | 'down';
  disabledScrollDirectionDetectionMs?: number;
};

const initialState: NavigatorState = {
  scrollDirection: 'up',
};

export const cartSlice = createSlice({
  name: 'navigator',
  initialState,
  reducers: {
    setScrollDirection: (state, action: PayloadAction<{ direction: 'up' | 'down' }>) => ({
      ...state,
      scrollDirection: action.payload.direction,
    }),
    setDisabledDetectScrollDirection: (state, action: PayloadAction<{ period?: number }>) => ({
      ...state,
      disabledScrollDirectionDetectionMs: action.payload.period,
    }),
  },
});

export const { setScrollDirection, setDisabledDetectScrollDirection } = cartSlice.actions;
const { reducer: navigatorReducer } = cartSlice;

export default navigatorReducer;
