const initialState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('token', action.payload);
            return { ...state, token: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false };
        default:
            return state;
    }
};
export default authReducer;

