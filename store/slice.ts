
import { createSlice } from "@reduxjs/toolkit";


export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchText: "",
        searchTriggered: false,
    },
    reducers: {
        setSearchText: (state, action) => {
        state.searchText = action.payload;
        },
        triggerSearch: (state) => {
            state.searchTriggered = !state.searchTriggered;
        }
    },
    });

export const { setSearchText , triggerSearch } = searchSlice.actions;
export default searchSlice.reducer;