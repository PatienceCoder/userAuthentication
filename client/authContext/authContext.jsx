import { useState } from "react";
import { createContext, useContext } from "react";

const AuthContext = createContext();
export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({children}) => {
    const [authenticatedUser,setAuthenticatedUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);
    console.log(authenticatedUser)
    return <AuthContext.Provider value={{authenticatedUser,setAuthenticatedUser}}>
        {children}
    </AuthContext.Provider>
}
