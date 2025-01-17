import axios from "axios";
import qs from "qs";

export function postExamen(data = null) {
    if (data) {
        const config = {
            method: "post",
            url: `${process.env.REACT_APP_BACKEND_URL}insert_examen`,
            data: qs.stringify(data),
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        };

        return axios(config);
    }
}


