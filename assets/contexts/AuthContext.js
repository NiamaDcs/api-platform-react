import React from 'react'; 

//prend la forme des donnees 
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: value => {}
})