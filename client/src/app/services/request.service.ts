import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const SERVER_URL = 'http://localhost:3000';

@Injectable()

export class Request {
    constructor(private http: Http) {}
    
    processResponse(response: Promise<Response>) {
        return response.then(res => res.json())
        .catch(error => error.json())
        .then(resJson => {
            if (!resJson.success) Promise.reject(resJson.code);
            return resJson;
        });
    }

    get(subUrl: string) {
        const headers = new Headers({ token: localStorage.getItem('token') })
        const response = this.http.get(SERVER_URL + subUrl).toPromise();
        return this.processResponse(response);
    }
    
    post(subUrl: string, body) {
        const headers = new Headers({ token: localStorage.getItem('token') })
        const response = this.http.post(SERVER_URL + subUrl, body).toPromise();
        return this.processResponse(response);
    }

    put(subUrl: string, body) {
        const headers = new Headers({ token: localStorage.getItem('token') })
        const response = this.http.put(SERVER_URL + subUrl, body).toPromise()
        return this.processResponse(response);
    }

    delete(subUrl: string) {
        const headers = new Headers({ token: localStorage.getItem('token') })
        const response = this.http.delete(SERVER_URL + subUrl).toPromise();
        return this.processResponse(response);
    }
}
