import axios from 'axios'
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'

const userLoginData = async (loginData) => {
    const response = await axios.post('login', loginData)
    console.log(response.data)
    if (response.data.token) {
        localStorage.setItem('loginuser', JSON.stringify(response.data))
    }
    return response.data
}

const initialState = {
    login: { username: "", password: ""},
    isError: false,
    isLoggedIn: false,
    isLoading: false,
    message: ''
}


export const loginUser = createAsyncThunk(
    'auth/loginUser', async (login, thunkAPI) => {
        try {
            return await userLoginData(login)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const logout = createAction('auth/logout')

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
    reset: () => initialState
       },
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => { 
                 return initialState
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(loginUser.fulfilled, (state, {payload}) => {
                console.log('Payload:',payload)
                state.isLoading = false
                state.isLoggedIn = true
                state.login = payload
               
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.isLoading = false
                state.isError = true
                state.message = payload
                state.user = null
            })
    }
})

export const { reset } = loginSlice.actions

export default loginSlice.reducer