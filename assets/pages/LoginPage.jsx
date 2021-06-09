import React, { useState, useContext } from 'react'; 
import AuthAPI from '../services/authAPI';
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    //cette state sera un objet
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    //gestion des champs
    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget; 
        setCredentials({ ...credentials, [name]: value });
    }

    //gestion du submit
    const handleSubmit = async event => {
        event.preventDefault(); //pour ne pas que evenement charge la page 

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError(
                "Aucun compte ne possède cette adresse email ou les informations ne correspondent pas "
            );
        }
    }
   

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    label="Adresse email" 
                    name="username" 
                    value={credentials.username} 
                    onChange={handleChange} 
                    placeholder="Adresse email de connexion" 
                    error={error} 
                />
                 <Field 
                    label="Mot de passe" 
                    name="password" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    type="password" 
                    error={error} 
                />       
                <div className='form-group mt-2'>
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </> 
    );
}
 
export default LoginPage;