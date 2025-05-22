const backend_link = `http://${process.env.NEXT_PUBLIC_BACKEND_PORT}`

import Cookies from "js-cookie";

function base64UrlDecode(base64Url: string) {
    // Replace non-standard base64 characters with standard base64 characters
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary
    while (base64Url.length % 4) {
        base64Url += '=';
    }


    return atob(base64Url);
}

function decodeJWT(token: string) {
    const [header, payload, signature] = token.split('.');

    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    /**
     * 
     * Isi JWT itu 
     *  payload: {
            "sub": "student@student.com",
            "role": "STUDENT",
            "userId": "fdad9500-dbf0-4041-9bb5-349f03b23bb8",
            "iat": 1747915438,
            "exp": 1747919038
        }
        
        jadi mau ambil userId => decodeJWT(token).payload.userId
     */

    return {
        header: decodedHeader,
        payload: decodedPayload
    };
}


async function checkJWT() {
    const access_token = Cookies.get("token")

    /**
     * True = jwt aman
     * False = jwt ngga aman
     */

    if (access_token) {
        const exp = decodeJWT(access_token).payload.exp
        return !(exp <= Date.now() / 1000)
    }
    else return false;
}

function getMessageOnInput(message: string | null, messages: string | null) {
    const currentMessage = message || messages
    if (currentMessage && currentMessage.startsWith("Validation failed"))
        alert("Input must not be blank")
    else {
        alert(currentMessage)
    }
}


export { decodeJWT, checkJWT, getMessageOnInput, backend_link }

