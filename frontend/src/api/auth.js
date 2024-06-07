const API = `${process.env.REACT_APP_SERVER_URL}/auth`;

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


// save token and sessionId into local storage
export const saveSession = (data, next) => {
    if(typeof window != "undefined"){
        localStorage.setItem("chatapp", JSON.stringify(data));
        next();
    }
}

export const isAuthenticated = () => {
    if(typeof window == "undefined"){
        return false;
    }

    if(localStorage.getItem("chatapp")){
        return JSON.parse(localStorage.getItem("chatapp"))
    }
    else return false;
}

export const loginStatus = async() => {
    return await all("/status", "GET");
}

export const register = async(data) => {
    const body = JSON.stringify(data);
    const headers = {
        "Content-Type": "application/json"
    }
    return await all("/register", "POST", headers, body);
}

export const login = async(data) => {
    const body = JSON.stringify(data);
    const headers = {
        "Content-Type": "application/json",
    }
    return await all("/login", "POST", headers, body)
}

export const logout = async() => {
    
    return all("/logout", "GET")
        .then(res => {
            if(res.success){
                if(typeof window != "undefined"){
                    localStorage.removeItem("chatapp");
                }
            }
            return res;
        })
}