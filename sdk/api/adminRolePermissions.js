import fetchAPI from '../fetchAPI.js'

async function find(adminFindRequest) {
    if (typeof adminFindRequest !== 'object') {
        throw new Error('adminFindRequest must be an object');
    }

    const { client_side_uuid } = adminFindRequest;
    const response = await fetchAPI.request(`admin/role_permissions/${client_side_uuid}`, { method: 'GET' }, true);
    return await response.json();
}

async function findAll(adminFindAllRequest) {
    if (typeof adminFindAllRequest !== 'object') {
        throw new Error('adminFindAllRequest must be an object');
    }

    const { page, limit } = adminFindAllRequest;
    let endpoint = `admin/role_permissions?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    return await response.json();
}

async function create(createRequest) {
    if (typeof createRequest !== 'object') {
        throw new Error('createRequest must be an object');
    }

    const response = await fetchAPI.request('admin/role_permissions', {
        method: 'POST',
        body: createRequest
    }, true);

    return await response.json();
}

async function update(updateRequest) {
    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/role_permissions', {
        method: 'PUT',
        body: updateRequest
    }, true);

    return await response.json();
}

async function destroy(deleteRequest) {
    if (typeof deleteRequest !== 'object') {
        throw new Error('deleteRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/role_permissions', {
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
    destroy,
}
