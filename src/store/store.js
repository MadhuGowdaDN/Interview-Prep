import { configureStore } from '@reduxjs/toolkit';

import assessmentReducer from '@features/assessments/assessmentSlice';
import authReducer from '@features/auth/authSlice';
import mappingReducer from '@features/mapping/mappingSlice';
import prepareReducer from '@features/prepare/prepareSlice';

// Configure standard Redux Toolkit Store with Feature slices
export const store = configureStore({
    reducer: {
        auth: authReducer,
        assessments: assessmentReducer,
        mapping: mappingReducer,
        prepare: prepareReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});
