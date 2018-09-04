
import { RequestOptions } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpService {

    constructor(private http: HttpClient) {
    }

    public getConversionRates(source: string, dest: string): Observable<any> {
        const url: string = 'http://free.currencyconverterapi.com/api/v5/convert?q=' +
            source + '_' + dest + '&compact=y';
        return this.http.get(url);
    }

    public memoizedRate(): Function {
        const cache = {};
        return (source, dest) => {
            const key = source + '_' + dest;
            if (key in cache) {
                console.log('Fetching from cache');
                return cache[key];
            } else {
                console.log('Calculating result');
                const result = this.getConversionRates(source, dest);
                cache[key] = result;
                return result;
            }
        }
    }

}
