const backend_link = "http://localhost:8080"

import Cookies from "js-cookie";

function base64UrlDecode(base64Url: string) {
    // Replace non-standard base64 characters with standard base64 characters
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary
    while (base64Url.length % 4) {
        base64Url += '=';
    }

    // Decode base64 string to a regular string
    return atob(base64Url);
}

function decodeJWT(token: string) {
    // Split the JWT into three parts
    const [header, payload, signature] = token.split('.');

    // Decode the header and payload
    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return {
        header: decodedHeader,
        payload: decodedPayload
    };
}

async function checkJWT() {
    const access_token = Cookies.get("token")

    if (access_token) {
        const exp = decodeJWT(access_token).payload.exp
        return !(exp <= Date.now() / 1000)
    }
    else return false;
}

export { decodeJWT, checkJWT, backend_link }

