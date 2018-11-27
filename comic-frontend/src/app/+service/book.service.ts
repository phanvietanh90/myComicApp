import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AbstractService} from "./abstract.service";

@Injectable()
export class BookService extends AbstractService {
    constructor(private http: HttpClient) {
        super();
    }
    public getBookById(id): any {
        console.log("get book by id: " + id);
        const headers = new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });

        const options = {
            headers: headers
        };

        return this.http.get(environment.book_service.get_book_endpoint + id, options);
    }



    public update(book): any {
        console.log("book: " + JSON.stringify(book));
        const headers = new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });

        const options = {
            headers: headers
        };

        let bookRequest = {bookEntity: book};
        return this.http.put(environment.book_service.update_book_endpoint , bookRequest, options);
    }


}