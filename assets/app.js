
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import './bootstrap';
import Navbar from './js/components/Navbar';
import CustomersPage from "./js/pages/CustomersPage";
import HomePage from "./js/pages/HomePage";
import InvoicesPage from './js/pages/InvoicesPage';
import LoginPage from './js/pages/LoginPage'
import AuthAPI from './js/services/authAPI';
import AuthContext from './js/contexts/AuthContext';
import PrivateRoute from './js/components/PrivateRoute';
import './styles/app.css';
import CustomerPage from './js/pages/CustomerPage';
import InvoicePage from './js/pages/InvoicePage';
import RegisterPage from './js/pages/RegisterPage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


AuthAPI.setup();


const App = () => {

    // TODO: il faudrait par défaut qu'on demande à notre AuthAPI si on est connecté ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );
    
    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} /> 
                        <Route path="/register" component={RegisterPage} /> 
                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} /> 
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
        </AuthContext.Provider>
    );
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);