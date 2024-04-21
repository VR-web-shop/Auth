import fetchAPI from '../fetchAPI.js'

async function find(findRequest) {
    if (typeof findRequest !== 'object') {
        throw new Error('findRequest must be an object');
    } 

    const { name } = findRequest;
    const response = await fetchAPI.request(`admin/permissions/${name}`, { method: 'GET' }, true);
    return await response.json();
}

async function findAll(findAllRequest) {
    if (typeof findAllRequest !== 'object') {
        throw new Error('findAllRequest must be an object');
    }

    const { page, limit } = findAllRequest;
    let endpoint = `admin/permissions?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    return await response.json();
}

async function create(createRequest) {
    if (typeof createRequest !== 'object') {
        throw new Error('createRequest must be an object');
    }

    const response = await fetchAPI.request('admin/permissions', {
        method: 'POST',
        body: createRequest
    }, true);

    return await response.json();
}

async function update(updateRequest) {
    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/permissions', {
        method: 'PUT',
        body: updateRequest
    }, true);

    return await response.json();
}

async function destroy(deleteRequest) {
    if (typeof deleteRequest !== 'object') {
        throw new Error('deleteRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/permissions', {
        method: 'DELETE',
        body: deleteRequest
    }, true);

    if (response.status === 203) {
        return true;
    } else {
        return false;
    }
}

export default {
    find,
    findAll,
    create,
    update,
    destroy
}
