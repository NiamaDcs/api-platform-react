const cache = {}; 

/**
 * fonction qui permet de reinitialiser mes donnees en cache 
 */
function set(key, data) {
    cache[key] = {
        data, 
        cacheAt: new Date().getTime()
    }
}

/**
 * une fonction permet de verifier si ma cle existe de me le render en faisant
 * une verification en fonction de la date puis me retourne mes donnee en cache si elle est inferieur 
 * a la date d'aujoud'hui
 */
function get(key) {
    return new Promise((resolve) => {
        resolve(
            cache[key] && cache[key].cacheAt + 15 * 60 * 1000 > new Date().getTime()  
            ? cache[key].data 
            : null
        )
    });
}

function invalidate(key) {
    delete cache[key];
}

export default {
    set, 
    get,
    invalidate
}