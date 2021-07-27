import axios from "axios"; 
import Cache from './cache';
import { INVOICES_API } from "../config";

async function findAll() {
    const cachedInvoices = await Cache.get("invoices");

    if(cachedInvoices) return cachedInvoices;

    return axios 
        .get(INVOICES_API)
        .then(response => {

            const invoices = response.data["hydra:member"];
            Cache.set("invoices", invoices);
            return invoices;
        }
        )
}

function deleteInvoice(id) {
    return axios.delete(INVOICES_API + "/" + id)
    .then( async response => {
        const cachedInvoices = await Cache.get("invoices");

        if(cachedInvoices) {
            Cache.set("invoices", cachedInvoices.filter(c => c.id !== id));
        }
        return response; 
    });
}

async function find(id) {
    const invoice = await Cache.get("invoices." + id);
    if(invoice) return invoice;

    return axios
    .get(INVOICES_API + "/" + id)
    .then(response => {
        const invoice =  response.data;

        Cache.set("invoices." + id, invoice);
        return invoice;
    });
}

function update(id, invoice) {
    return  axios
    .put(INVOICES_API + "/" + id, { 
            ...invoice, 
            customer: `/api/customers/${invoice.customer}` 
    })
    .then(async response => {
        const invoices = await Cache.get("invoices");
        const invoice = await Cache.get("invoices." + id);

        if(invoice) {
            Cache.set("invoices." + id, response.data); 
        }

        if(invoices) {

            const index = invoices.findIndex(c => c.id === +id);
            invoices[index] = response.data;;
            
        }
        return response; 
    });
}

function create(invoice){
    return axios.post(
        INVOICES_API, { 
            ...invoice, 
            customer: `/api/customers/${invoice.customer}` 
    })
    .then(async response => {
        const invoices = await Cache.get("invoices");

        if(invoices){
            Cache.set("invoices", [...invoices, response.data]);
        }

        return response; 
    });
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteInvoice, //properties delete qui represente deleteInvoice
};