
export default function AuthDTO(access_token) {
    if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token is required and must be an string");
    }

    return { access_token }
}
 