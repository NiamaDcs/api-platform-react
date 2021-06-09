import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/CustomersAPI';
import { Link } from 'react-router-dom';

const CustomersPage = (props) => {

    // customers un state et setCustomers qui me permet de modifier mon state 
    const [customers, setCustomers] = useState([]);

    /**
     * cet usestate permet de savoir la page courante et le modifier par defaut je met 1
     */
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

     //permet de recuperer les customers et de stocker la data via setCustomers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll(); 
            setCustomers(data);
        }catch(error) {
            error =>console.log(error.response)
        }
    }

    //au chargement du composant, on va chercher les customers
    useEffect(() => {
     fetchCustomers()
    }, []);

    // gestion de la suppression d'un customer
    const handleDelete = async (id) => {

        const originalcustomers = [...customers]; //faire une copie de mon tableau de mon customer
        setCustomers(customers.filter(customer => customer.id !== id));
        try {
           await CustomersAPI.delete(id)
        }catch(error) {
            setCustomers(originalcustomers);
        }
    }

    // gestion du chargement de la page 
    const handlePageChange = (page) => setCurrentPage(page);
    
    // gestion de la recherche 
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }
    const itemsPerPage = 8;

    //filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) || 
            c.lastName.toLowerCase().includes(search.toLowerCase())  || 
            c.email.toLowerCase().includes(search.toLowerCase()) || 
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );
    
    // pagination des donnees
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage,
        itemsPerPage
    ); 

    return ( 
        <>
        <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1> 
            <Link to="/customers/new" className="btn btn-primary">Crée un client</Link>
        </div>
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
                        <th>ID</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer =>
            
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge bg-primary">{customer.invoices.length}</span>
                            </td>
                            <td>{customer.totalAmount.toLocaleString()} €</td>
                            <td className="text-center">
                                <button 
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={ customer.invoices.length > 0 } 
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination 
                    currentPage={currentPage} 
                    itemsPerPage={itemsPerPage} 
                    length={filteredCustomers.length} 
                    onPageChanged={handlePageChange} 
                />
            )}
            
        </>
    );
}
 
export default CustomersPage;