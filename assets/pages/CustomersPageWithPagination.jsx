import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';


const CustomersPageWithPagination = (props) => {

    // customers un state et setCustomers qui me permet de modifier mon state 
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);


    /**
     * cet usestate permet de savoir la page courante et le modifier par defaut je met 1
     */
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 8;

     //Quand j'aurais ces donnee data je vais changer la donnee dans mon customer via setcustomer
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then(response => {
            setCustomers(response.data["hydra:member"]);
            setTotalItems(response.data["hydra:totalItems"]);
            setLoading(false);
        })
        .catch(error =>console.log(error.response));
    }, [currentPage]);

    const handleDelete = (id) => {

        const originalcustomers = [...customers]; //faire une copie de mon tableau de mon customer
        //l'approche optimiste, tres rapide
       setCustomers(customers.filter(customer => customer.id !== id));

        //2. l'approche pessimiste

        axios.delete("http://127.0.0.1:8000/api/customers/" + id)
        .then(response => console.log("ok"))
        .catch(error => {
            setCustomers(originalcustomers);
            console.log(error.response)
        });
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }


    const paginatedCustomers = Pagination.getData(
        customers, 
        currentPage,
        itemsPerPage
    ); 

    return ( 
        <>
            <h1>Liste des clients pagination </h1> 

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
                    { loading && (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )}
                    {!loading && customers.map(customer =>
            
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.compagny}</td>
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

            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                length={totalItems} 
                onPageChanged={handlePageChange} 
            />
            
        </>
    );
}
 
export default CustomersPageWithPagination;