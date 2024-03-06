

import { createSlice } from '@reduxjs/toolkit';
import algoliasearch from "algoliasearch/lite";

const initialState = {
  searchClient: algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef'),
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Add any reducers here
    
  },
});

export const {} = searchSlice.actions;

export default searchSlice.reducer;
