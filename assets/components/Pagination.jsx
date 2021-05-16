import React from 'react';


//<Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
//length={customers.length} onPageChanged={handlePageChange} />
            
const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged }) => {

    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    // je vais compter
    for(let i=1; i <= pagesCount; i++) {
        pages.push(i);
    }
    return (
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + ( currentPage === 1 && " disabled")}>
                    <button 
                        className="page-link" 
                        onClick={ () => onPageChanged(currentPage - 1)}>
                        &laquo;
                    </button>
                </li>
                {
                    pages.map(page => 
                        
                        <li key={page} className={"page-item" + (currentPage === page && " active") }>
                            <button className="page-link" onClick={() => onPageChanged(page)}>
                                {page}
                            </button>
                        </li>
                    )
                }
                <li className={"page-item" + ( currentPage === pagesCount && " disabled")}
                >
                    <button 
                        className="page-link" 
                        onClick={ () => onPageChanged(currentPage + 1)}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </div>
    )
};

// une fonction qui va recevoir des items (customers, invoice, users)
Pagination.getData = (items, currentPage, itemsPerPage) => {

    // d'ou on part (start) pendant combien (itemsPerPage) slice permet de couper un tableau en morceau de tableau
    const start = currentPage * itemsPerPage - itemsPerPage;
    //              3         *     10       -      10  = 30-10 = 20
    return items.slice(start, start + itemsPerPage);
}

export default Pagination;