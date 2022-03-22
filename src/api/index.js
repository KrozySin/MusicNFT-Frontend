import { Axios } from "../core/axios"

const rURL = (url) => {
    return `${process.env.REACT_APP_API_URL}${url}`;
}


export const getTokenByOwner = async (owner, limit, cnt) => {
    const response = await Axios.post(rURL("get_item_by_owner"), {
        owner: owner,
        limit: limit,
        cnt: cnt
    })

    return response.data;
}
