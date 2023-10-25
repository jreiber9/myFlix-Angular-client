/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = null;
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * fetches the user's info from the api
   */
  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      return this.user;
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      },
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: director.Name,
        content: director.Bio,
      },
    });
  }

  openSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Description',
        content: synopsis,
      },
    });
  }

  /**
   * adds the movie (by id) to an array of the user's favorite movies
   * @param id movie id
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie added to favorites.', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * checks if the movie id is in the user's favorite movie array
   * @param id movie id
   * @returns true or false
   */
  isFavorite(id: string): boolean {
    return this.user?.FavoriteMovies.includes(id);
  }

  /**
   * removes the movie (by id) from the user's array of favorite movies
   * @param id movie id
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites.', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }
}
