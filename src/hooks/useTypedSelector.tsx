import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
