// src/common/utils/createDynamicSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "./apiClient";

// Common API call function
const makeApiCall = async (config, data, thunkAPI) => {
    const { method = "post", url, headers = {}, withCredentials = true } = config;

    try {
        const result = await apiClient({
            method,
            url,
            data: method.toLowerCase() === "get" ? undefined : data || {}, // Don't send data for GET
            params: method.toLowerCase() === "get" ? data || {} : undefined, // Use data as params for GET
            withCredentials,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        });
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
};

// Slice generator function
export const createDynamicSlice = (sliceConfig) => {
    const {
        name,
        initialState = {},
        reducers = {},
        asyncThunks = [],
        extraReducers = () => { },
    } = sliceConfig;

    // Generate initial state with loading states for each async thunk
    const dynamicInitialState = {
        ...initialState,
        loading: false,
        error: {},
        success: {},
        successMessage: "",
        errorMessage: "",
        data: [],
    };

    // Create async thunks dynamically
    const thunks = {};
    asyncThunks.forEach((thunkConfig) => {
        const {
            name: thunkName,
            method,
            url,
            // storeKey = thunkName,
            // loadingKey = thunkName,
            // errorKey = thunkName,
            // successKey = thunkName,
            headers = {},
            withCredentials = true,
            transformResponse = (data) => data,
        } = thunkConfig;

        const thunk = createAsyncThunk(
            `${name}/${thunkName}`,
            async (data, thunkAPI) => {
                // Handle URL parameters if needed (e.g., /users/:id)
                let finalUrl = url;
                if (data && data.urlParams) {
                    Object.entries(data.urlParams).forEach(([key, value]) => {
                        finalUrl = finalUrl.replace(`:${key}`, value);
                    });
                }

                // Safely determine the request body
                let requestData = data;
                if (data && data.body !== undefined) {
                    requestData = data.body;
                } else if (data && data.urlParams) {
                    // Remove urlParams from the payload if it exists so it doesn't go in body
                    const { urlParams, ...rest } = data;
                    requestData = rest;
                }

                const result = await makeApiCall(
                    { method, url: finalUrl, headers, withCredentials },
                    requestData,
                    thunkAPI,
                );
                return transformResponse(result);
            },
        );

        thunks[thunkName] = thunk;
    });

    // Create the slice
    const slice = createSlice({
        name,
        initialState: dynamicInitialState,
        reducers: {
            clearError: (state, action) => {
                const key = action.payload;
                if (key) {
                    state[key] = "";
                } else {
                    state.errorMessage = "";
                }
            },
            clearSuccess: (state, action) => {
                const key = action.payload;
                if (key) {
                    state[key] = "";
                } else {
                    state.successMessage = "";
                }
            },
            clearData: (state, action) => {
                const key = action.payload;
                if (key) {
                    delete state[key];
                } else {
                    state.data = [];
                }
            },
            resetState: (state) => {
                Object.assign(state, dynamicInitialState);
            },
            ...reducers,
        },
        extraReducers: (builder) => {
            asyncThunks.forEach((thunkConfig) => {
                const { name: thunkName, storeKey, loadingKey } = thunkConfig;

                const thunk = thunks[thunkName];
                builder
                    .addCase(thunk.pending, (state) => {
                        if (loadingKey) {
                            state[loadingKey] = true;
                        } else {
                            state.loading = true;
                        }
                    })
                if (!thunkConfig.customExtraReducer) {
                    builder.addCase(thunk.fulfilled, (state, action) => {
                        if (loadingKey) {
                            state[loadingKey] = false;
                        } else {
                            state.loading = false;
                        }
                        if (storeKey) {
                            state[storeKey] = action.payload;
                        } else {
                            state.successMessage = action.payload?.message || "Success";
                        }
                        state.errorMessage = "";
                    })
                }
                builder.addCase(thunk.rejected, (state, action) => {
                    if (loadingKey) {
                        state[loadingKey] = false;
                    } else {
                        state.loading = false;
                    }
                    state.errorMessage =
                        action.payload?.message || `${thunkName} failed`;
                });
            });

            if (extraReducers) {
                extraReducers(builder, thunks);
            }
        },
    });

    return {
        slice,
        thunks,
        actions: slice.actions,
        reducer: slice.reducer,
    };
};
