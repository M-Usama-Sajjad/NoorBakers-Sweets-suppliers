const initialState = {
    token: null,
    isAuthenticated: false,
    user: null,
};

const authReducer = (state = initialState, action) => {
    console.log('Auth reducer action:', action); // Log the action for debugging
    switch (action.type) {
        case 'LOGIN':
            return { ...state, token: action.payload.token, isAuthenticated: true, user: action.payload.user };
        case 'LOGOUT':
            return { ...state, token: null, isAuthenticated: false, user: null };
        default:
            return state;
    }
};

export default authReducer;

