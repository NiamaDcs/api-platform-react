import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/CustomersAPI';
import InvoicesAPI from '../services/InvoicesAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';

const InvoicePage = ({ match, history }) => {

    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount:"",
        customer:"",
        status:"SENT"
    });

    const [errors, setErrors] = useState({
        amount:"",
        customer:"",
        status:""
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);
    
    const [loading, setLoading] = useState(true);

    // recuperer des clients 
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            if(!invoice.customer) setInvoice({ ...invoice, customer: data[0].id })

        }catch (error) {
            toast.error("Impossible de charger les clients");
            history.replace("/invoices");
        }
    }
    // gestion des changements des inputs dans le formulaire 
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    // recuperer une facture
    const fetchInvoice = async id => {

       try {
            const { amount, status, customer } = await InvoicesAPI.find(id);
            setInvoice({ amount, status, customer: customer.id });
            setLoading(false);
       } catch (error) {
        toast.error("Impossible de charger la facture demandée");
           history.replace("/invoices")
       }
    }

    //recuperation de la liste des clients à  chaque changements du composant
    useEffect(() => {
        fetchCustomers();
    }, [])

    // Récuperation de la bonne facture quand l'identifiant de l'URL change 
    useEffect(() => {
        if(id !== "new" ) {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id])

   
    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        
        try {

            if(editing){
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien éte modifiée");
                
            }else{
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistrée");
                history.replace("/invoices");
            }

        } catch(error) {
            const { violations } = error.response.data;
            if(violations) {
                violations.forEach( violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });

                setErrors(apiErrors);
            }
            toast.error("Des erreurs  dans votre formulaire");
        }

    }
    

    return (
        <>
         { (editing && <h1>Modification d'une facture</h1>) || (
            <h1>Création d'une facture</h1>
         
         )}
         {loading && <FormContentLoader />}
         {!loading && (
         <form onSubmit={handleSubmit}>
            <Field
                name="amount"
                type="number"
                placeholder="Montant de la facture"
                label="Montant"
                value={invoice.amount}
                onChange={handleChange}
                error={errors.amount}
            />
            <Select
                name="customer"
                label="Client"
                onChange={handleChange}
                defaultValue={invoice.customer} 
                error={errors.customer}
            >
                {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                    </option>
                ))}
            </Select>
            <Select 
                name="status" 
                label="Statut" 
                onChange={handleChange}
                defaultValue={invoice.status} 
                error={errors.status} 
            >
                <option value="SENT">Envoyé</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
            </Select>
            <div className="form-group mt-2">
                <button type="submit" className="btn btn-success">
                    Enregistrer
                </button>
                <Link to="/invoices" className="btn btn-link"> retour aux factures</Link>
            </div>
         </form>)}
        </> 
    );
}
 
export default InvoicePage;