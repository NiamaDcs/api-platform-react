import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

/**
 *  Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'];
    
}

/**
 * Requête HTTP d'authentication et stockage du token dans le storage et sur Axios 
 * @param{object} credentials
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function authenticate(credentials) {

    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {

            //stocker le token dans mon localstorange
            window.localStorage.setItem("authToken", token);
            
            //on prévient Axios qu'on a maintenant un header par défaut sur toutes nos factures requetes HTTP
            setAxiosToken(token);      
        });       
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup () {
    //1. voir si on a un token ? 
    const token = window.localStorage.getItem("authToken"); 

    //2. si le token est encore valide sur
    if(token){
        const { exp: expiration } = jwtDecode(token);
        //si ma date d'expieration est plus grand que la date de maintenant
        if(expiration * 1000 > new Date().getTime()) {
          setAxiosToken(token)    
        }    
    } 
}

/**
 * Permet de savoir si on est authentifié ou pas 
 * @returns boolean
 */
function isAuthenticated () {

    //1. voir si on a un token ? 
    const token = window.localStorage.getItem("authToken"); 

    //2. si le token est encore valide sur
    if(token) {
        const { exp: expiration } = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout, 
    setup,
    isAuthenticated
}