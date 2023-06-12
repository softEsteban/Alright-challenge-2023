import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class DocsService {

    host = environment.host;
    token: string;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.token = this.authService.getSessionToken();
    }

    // , { headers: { Authorization: `Bearer ${this.token}` } }
    async getAllDocsByUser(userId: string) {
        return await lastValueFrom(
            this.http.get(`${this.host}/docs/getDocsByUser/${userId}`)
        );
    }

    async getUsersSelect() {
        return await lastValueFrom(
            this.http.get(`${this.host}/auth/getUsersSelect`)
        );
    }

    async createDoc(doc: any) {
        return await lastValueFrom(
            this.http.post(`${this.host}/docs/createDoc`, doc)
        );
    }

    async requestRevision(docId: any, userIdGuest: string, userIdOwner: string) {
        return await lastValueFrom(
            this.http.put(`${this.host}/docs/requestRevision/${docId}/${userIdGuest}/${userIdOwner}`, {})
        );
    }

}
