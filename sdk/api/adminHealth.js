/**
 * @module sdk/api/healthAdminController
 * @description Health Admin Controller API
 * @requires module:/fetchAPI
 */

import fetchAPI from '../fetchAPI.js'

/**
 * @function check
 * @description Check the health of the application 
 * @returns {Promise<Object>} The health of the application.
 */
async function check() {
    const response = await fetchAPI.request(`admin/health`, { method: 'GET' }, true);
    return await response.json();
}

export default {
    check
}
