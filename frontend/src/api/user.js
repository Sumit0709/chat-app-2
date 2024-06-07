const API = `${process.env.REACT_APP_SERVER_URL}/user`;

const catchError = {
    success: false,
    error: "Something went wrong while talking to server!"
}


const all = async (route, method, header={}, body=null) => {

    return fetch(`${API}${route}`, {
        method: method,
        headers: header,
        credentials: 'include',
        body: method == "GET"? null : body
    })
    .then(res => res.json())
    .catch(err => {
        return catchError
    })
}


export const addFriend = async(data) => {
    const body = JSON.stringify(data);
    const headers = {
        "Content-Type": "application/json"
    }
    return await all("/send_friend_request", "POST", headers, body);
}

export const getFriends = async(data) => {
    const body = JSON.stringify(data);
    const headers = {}
    return await all("/get_friend", "GET", headers, body);
}