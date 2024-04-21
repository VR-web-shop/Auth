import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ModelQuery from "../queries/abstractions/ModelQuery.js";
import _db from '../../db/models/index.cjs';

export default function ModelQueryService(db=_db) {
    if (!db) throw new ServiceArgumentError('db is required');
    if (typeof db !== 'object') 
        throw new ServiceArgumentError('db must be an object');
    
    const invoke = async (query) => {
        if (!query) throw new ServiceArgumentError('Query is required');
        if (!(query instanceof ModelQuery))
            throw new ServiceArgumentError('Query must be an instance of ModelQuery');
        
        return await query.execute(db);
    }

    return {
        invoke
    }
}
