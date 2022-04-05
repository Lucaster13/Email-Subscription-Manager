import {useState, useEffect} from "react";

const get_meta_url = `/api/getMetadata`;
const get_subs_url = "/api/getSubscriptions"
const get_ids_url = (userId, access_token, numIds = "") => `/api/getMessageIds?userId=${userId}&access_token=${access_token}&numIds=${numIds}`;
const FETCH_SIZE = 50;

function useFetchMeta (userId, access_token){
    const [meta, setMeta] = useState(null);
    const [ids, setIds] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // start making gmail api calls
    useEffect(() => {
        const fetchMeta = async () => {
            setLoading(true);
            try {
                // retrieve ids
                console.log("retrieving ids...");
                const idResponses = await fetch(get_ids_url(userId, access_token, FETCH_SIZE));
                const idJson = await idResponses.json();
                const ids = idJson.map(({id}) => id);
                setIds(ids);

            
                // set up paginated calls to reduce body size 
                console.log("retrieving meta...");
                const chunkSize = 1000;
                const meta = await loadChunks(userId, access_token, chunkSize, ids, "meta");
                setMeta(meta);
                
                console.log("loaded successfully!");
            } catch (e) {
                setError(e);
            } finally{
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);
  
    return { error, loading, meta, ids };
}

function useFetch (userId, access_token){
    const [data, setData] = useState(null);
    const [meta, setMeta] = useState(null);
    const [ids, setIds] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // start making gmail api calls
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // retrieve ids
                console.log("retrieving ids...");
                const idResponses = await fetch(get_ids_url(userId, access_token, FETCH_SIZE));
                const idJson = await idResponses.json();
                const ids = idJson.map(({id}) => id);
                setIds(ids);

            
                // set up paginated calls to reduce body size 
                console.log("retrieving email subscription objects...");
                const chunkSize = 1000;
                const data = await loadChunks(userId, access_token, chunkSize, ids, "subs");
                setData(data);
                
                console.log("data loaded successfully!");
            } catch (e) {
                setError(e);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, []);
  
    return { data, error, loading, meta, ids };
}

async function loadChunks(userId, access_token, chunkSize, ids, action = "none"){
    var chunk_data = null;

    const numIds = ids.length;
    for (var i = 0, j = numIds; i < j; i += chunkSize) {

        const sliceSize = i + chunkSize;
        // extract chunk of ids
        const idChunk = ids.slice(i, sliceSize);
        // send meta params via post
        const options = {
            method: "post",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ids: idChunk, userId, access_token, chunkId: i})
        }
        // console.log("constructed post obj:", options);

        switch(action){
            case("meta"):{
                chunk_data = [];
                const res = await fetch(get_meta_url, options);
                const json = await res.json();
                chunk_data = [...chunk_data, ...json];
                break;
            }
            case("subs"):{
                chunk_data = {};
                const res = await fetch(get_subs_url, options);
                const json = await res.json();
                chunk_data = {...chunk_data, ...json};
                break;
            }
            default:
                break;
        }
    }   
    return chunk_data;
}

export{
    useFetch,
    useFetchMeta
}