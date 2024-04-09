
import { configureStore , combineReducers } from '@reduxjs/toolkit'
import {searchReducer} from './slice'
import {postsReducer} from './slice'

const rootReducer = combineReducers({
    search: searchReducer,
    posts: postsReducer,
});

export const store = () => {
    return configureStore({
        reducer: rootReducer,
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']