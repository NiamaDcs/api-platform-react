import React, { useState, useContext } from 'react'; 
import AuthAPI from '../services/authAPI';
import AuthContext from "../contexts/AuthContext";


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
                <div className='form-group'>
                    <label htmlFor="username" className="form-label mt-2">Adresse email</label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        className={"form-control" + (error && " is-invalid")} 
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                    />
                    { error && (<p className="invalid-feedback">{error}</p>) }
                </div>    
                

                <div className='form-group'>
                    <label htmlFor="password" className="form-label mt-2">Mot de passe</label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange}
                        type="password" 
                        className="form-control" 
                        placeholder="Mot de passe"
                        name="password"
                        id="password"
                    />
                </div>           
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