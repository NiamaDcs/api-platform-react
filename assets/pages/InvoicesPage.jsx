import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import moment from 'moment';
import InvoicesAPI from '../services/InvoicesAPI';
import { Link } from 'react-router-dom';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyé",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 8;

    // Récuperation des invoices auprès de l'API
    const fetchInvoices = async () => {

        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);

        }catch (error) {
            console.log(error.response);
        }
        
    }

    //charger les invoices au chargement du composant 
    useEffect(() => {
        fetchInvoices();
    }, []);

    //gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // gestion du chargement de la page 
    const handlePageChange = (page) => setCurrentPage(page);

    // gestion de la recherche 
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }
  

    //gestion de la supprimer
    const handleDelete = async id => {
        //copier mon tableau
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try {
            // essaye de supprimer 
            await InvoicesAPI.delete(id);
        }catch(error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    }

    //gestion de la rechercher; include qui fait partir
    const filteredInvoices = invoices.filter(
        i =>
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) || 
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().startsWith(search.toLowerCase()) || 
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) 
    );

    // pagination des donnees
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage,
        itemsPerPage
    ); 

    return ( 
        <>
        <div className="d-flex justify-content-between align-items-cent">
            <h1></h1>
            <Link className="btn btn-primary" to="/invoices/new">
                Créer une facture
            </Link>
        </div>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input 
                    type="text"  
                    onChange={handleSearch} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher..." 
                />
            </div>

            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => 
                        <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge bg-"+ STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link 
                                to={"/invoices/" + invoice.id} 
                                className="btn btn-sm btn-primary mr-1"
                            >
                                Editer
                            </Link>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>

            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                onPageChanged={handlePageChange}
                length={filteredInvoices.length}
            />
        </> 
    );
}
 
export default InvoicesPage;