import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Movie } from '../interfaces/movie';
import { MovieDetails } from '../interfaces/movie-details';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private url = 'http://cw-api.eu-west-3.elasticbeanstalk.com/movied';

  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
    
  getDiscoverMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.url+'/discover')
      .pipe(
        catchError(this.handleError<Movie[]>('getDiscoverMovies', []))
      );
  }
    
  getCategoryMovies(categoryId: number) {
    return this.http.get<Movie[]>(`${this.url}/categories/${categoryId}`)        
      .pipe(
        catchError(this.handleError<Movie[]>('getCategoryMovies', []))
      );
    }
    
  getCategoryNo404<Data>(categoryId: number): Observable<Movie> {
    return this.http.get<Movie[]>(`${this.url}/categories/${categoryId}`)
    .pipe(
      map(movies => movies[0]),
      catchError(this.handleError<Movie>(`getCategory id=${categoryId}`))
      );
    }
    
  getMovie(movieId: number) {
    return this.http.get<MovieDetails>(`${this.url}/movie/${movieId}`)        
    .pipe(
      catchError(this.handleError<MovieDetails>(`getMovie id=${movieId}`))
      );    
  }
    
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
