import AuthRequest from '../../src/dtos/AuthRequest.js'
import AuthResponse from '../../src/dtos/AuthResponse.js'
import fetchAPI from '../fetchAPI.js'

async function login(authCreateRequest) {
    if (!(authCreateRequest instanceof AuthRequest.CreateRequest)) {
        throw new Error('authCreateRequest must be an instance of AuthRequest.CreateRequest');
    }

    const response = await fetchAPI.request('auth', {
        method: 'POST',
        credentials: 'include',
        body: authCreateRequest
    });

    const data = await response.json();
    const res = AuthResponse.fromJSON(data);
    fetchAPI.setAuthToken(res.access_token);

    return res;
}

async function refresh() {
    const response = await fetchAPI.request('auth', {
        method: 'PUT',
        credentials: 'include'
    });

    const data = await response.json();
    const res = AuthResponse.fromJSON(data);
    fetchAPI.setAuthToken(res.access_token);

    return res;
}

export default {
    login,
    refresh,    
}
