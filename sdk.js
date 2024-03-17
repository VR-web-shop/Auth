import AuthRequest from './src/dtos/AuthRequest.js'
import AuthResponse from './src/dtos/AuthResponse.js'
import RoleResponse from './src/dtos/RoleResponse.js'
import UserRequest from './src/dtos/UserRequest.js'
import UserResponse from './src/dtos/UserResponse.js'

const sdk = function(serverURL) {
    const fetchAPI = async function(endpoint, options) {
        const response = await fetch(`${serverURL}/api/v1/${endpoint}`, options);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
    }

    this.auth = {
        login: async function(authCreateRequest) {
            if (!(authCreateRequest instanceof AuthRequest.CreateRequest)) {
                throw new Error('authCreateRequest must be an instance of AuthRequest.CreateRequest');
            }

            const response = await fetchAPI('auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(authCreateRequest)
            });
    
            const data = await response.json();
            return AuthResponse.fromJSON(data);
        },
        refresh: async function() {
            const response = await fetchAPI('auth', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
    
            const data = await response.json();
            return AuthResponse.fromJSON(data);
        }
    }

}

export default {
    dtos: {
        AuthRequest,
        AuthResponse,
        RoleResponse,
        UserRequest,
        UserResponse
    },
    sdk
}
