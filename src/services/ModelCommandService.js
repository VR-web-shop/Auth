import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ModelCommand from '../commands/abstractions/ModelCommand.js';
import _db from '../../db/models/index.cjs';

export default function ModelCommandService(db=_db) {
    if (!db) throw new ServiceArgumentError('db is required');
    if (typeof db !== 'object') 
        throw new ServiceArgumentError('db must be an object');
    
    const invoke = async (command) => {
        if (!command) throw new Error('Command is required');
        if (!(command instanceof ModelCommand))
            throw new ServiceArgumentError('Command must be an instance of ModelCommand');
        
        await command.execute(db);
    }

    return {
        invoke
    }
}
