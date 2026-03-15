import Pocketbase from 'pocketbase';

// En producción, Vercel usará la variable VITE_PB_URL configurada en sus ajustes.
// En local, usará por defecto el servidor de tu computadora.
const POCKETBASE_API_URL = import.meta.env.VITE_PB_URL || "http://127.0.0.1:8090";

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;
export { pocketbaseClient };
