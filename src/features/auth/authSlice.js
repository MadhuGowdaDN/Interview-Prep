import { createDynamicSlice } from '@common/utils/createDynamicSlice';
import { API_ROUTES } from '@constants';
const { LOGIN,
    REGISTER,
    LOGOUT, } = API_ROUTES.AUTH;
const authSliceConfig = {
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: !!localStorage.getItem('accessToken'),
    },
    asyncThunks: [
        {
            name: 'login',
            method: 'post',
            url: LOGIN,
            storeKey: 'user', // Depending on backend response, this could store the whole user
            customExtraReducer: true,
        },
        {
            name: 'register',
            method: 'post',
            url: REGISTER,
        },
        {
            name: 'logout',
            method: 'post',
            url: LOGOUT,
            customExtraReducer: true,
        },
    ],
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
        },
    },
    extraReducers: (builder, thunks) => {
        // Custom handling for successful login / logout
        builder.addCase(thunks.login.fulfilled, (state, action) => {
            state.loading = false;
            // If token is inside action.payload.accessToken
            if (action.payload?.data?.token) {
                localStorage.setItem('accessToken', action.payload.token);
            }
            state.isAuthenticated = true;
        });

        builder.addCase(thunks.logout.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
        });
    }
};

const { reducer, thunks, actions } = createDynamicSlice(authSliceConfig);

export const { login, register, logout } = thunks;
export const { setAuth, clearAuth, clearError, clearSuccess } = actions;
export default reducer;
