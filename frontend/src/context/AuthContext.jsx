import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
const u = localStorage.getItem('shynia_user');
return u ? JSON.parse(u) : null;
});

const login = (userData, token) => {
localStorage.setItem('shynia_token', token);
localStorage.setItem('shynia_user', JSON.stringify(userData));
setUser(userData);
};

const logout = () => {
localStorage.removeItem('shynia_token');
localStorage.removeItem('shynia_user');
setUser(null);
};

return (
<AuthContext.Provider
value={{
user,
login,
logout,
isLoggedIn: !!user,
isAdmin: user?.role === 'admin'
}}
>
{children}
</AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);
