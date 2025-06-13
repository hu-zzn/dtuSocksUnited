import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        message: null,
        isAuthenticated: false,

    },
    reducers: {
        registerRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null

        },
        registerSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        registerFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        otpVerificationRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        otpVerificationSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        otpVerificationFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loginRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        loginSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;

        },
        logoutSuccess(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.messager = null;
        },
        getUserRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = true;
        },
        getUserFailed(state) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },
        forgotPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        forgotPasswordFailed(state) {
            state.loading = false;
            state.error = action.payload;
        },

        resetPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        resetPasswordFailed(state) {
            state.loading = false;
            state.error = action.payload;
        },
        updatePasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;

        },
        updatePasswordFailed(state) {
            state.loading = false;
            state.error = action.payload;
        },



        resetAuthSlice(state) {
            state.error = null,
                state.loading = null,
                state.message = null,
                state.user = state.user;
            state.isAuthenticated = state.isAuthenticated;
        },

    }

});
export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.action.resetAuthSlice())
};
export const otpVerification = (email, otp) => async (dispatch) => {
    dispatch(authSlice.action.otpVerificationRequest());
    await axios.post("http://localhost:4000/api/v1/auth/verify-otp", { email, otp }, {
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
    }).then(res => {
        dispatch(authSlice.action.otpVerificationSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.action.register.otpVerificationFailed(error.response.data.message));
    })
};


export const login = (data) => async (dispatch) => {
    dispatch(authSlice.action.loginRequest());
    await axios.post("http://localhost:4000/api/v1/auth/login", data, {
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
    }).then(res => {
        dispatch(authSlice.action.loginSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.action.register.loginFailed(error.response.data.message));
    })
};
export const logout = () => async (dispatch) => {
    dispatch(authSlice.action.logoutRequest());
    await axios.get("http://localhost:4000/api/v1/auth/logout", {
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
    }).then(res => {
        dispatch(authSlice.action.logoutSuccess(res.data.message));
        dispatch(authSlice.action.resetAuthSlice());
    }).catch(error => {
        dispatch(authSlice.action.register.logoutFailed(error.response.data.message));
    })
};
export const getUser = () => async (dispatch) => {
    dispatch(authSlice.action.getUserRequest());
    await axios.get("http://localhost:4000/api/v1/auth/me", {
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
    }).then(res => {
        dispatch(authSlice.action.getUserSuccess(data));

    }).catch(error => {
        dispatch(authSlice.action.register.getUserFailed(error.response.data.message));
    })
};
export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.action.forgotPasswordRequest());
    await axios.post("http://localhost:4000/api/v1/auth/password/forgot", { email }, {
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
    }).then(res => {
        dispatch(authSlice.action.forgotPasswordSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.action.register.forgotPasswordFailed(error.response.data.message));
    })
};
export const resetPassword = (data) => async (dispatch) => {
    dispatch(authSlice.action.resetPasswordRequest());
    await axios.put(`http://localhost:4000/api/v1/auth/password/reset/${token}`,
        data,
        {
            withCredentials: true,
            headers: {
                "Content-type": "application/json",
            },
        }).then(res => {
            dispatch(authSlice.action.resetPasswordSuccess(res.data))
        }).catch(error => {
            dispatch(authSlice.action.register.resetPasswordFailed(error.response.data.message));
        })
};
export const updatePassword = (data) => async (dispatch) => {
    dispatch(authSlice.action.updatePasswordRequest());
    await axios.put(`http://localhost:4000/api/v1/auth/password/update`,
        data,
        {
            withCredentials: true,
            headers: {
                "Content-type": "application/json",
            },
        }).then(res => {
            dispatch(authSlice.action.updatePasswordSuccess(res.data))
        }).catch(error => {
            dispatch(authSlice.action.register.updatePasswordFailed(error.response.data.message));
        })
};
export default authSlice.reducer;

