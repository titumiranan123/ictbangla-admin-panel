import { configureStore } from "@reduxjs/toolkit";
import themeReducer from './features/themeSlice'
import courseReducer from './features/courseSlice'
export const store = configureStore({
    reducer:{
        theme:themeReducer,
        course:courseReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch