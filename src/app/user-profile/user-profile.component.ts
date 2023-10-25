import { Component, OnInit, Input } from '@angular/core';

// // You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// // This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

import { formatDate } from '@angular/common';

type User = {
  _id?: string;
  Username?: string;
  Password?: string;
  Email?: string;
  FavoriteMovies?: [];
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  initialInput: any = {};
  favorites: any = [];
  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * gets the user's account info and favorite movies from the api
   */
  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((user: any) => {
      console.log(user);
      this.userData.Username = user.Username;
      this.userData.Email = user.Email;
      this.userData.Birthday = formatDate(
        user.Birthday,
        'yyyy-MM-dd',
        'en-US',
        'UTC+0'
      );
      this.getUserFavorites(user.FavoriteMovies);
    });
  }

  getUserFavorites(userFavorites: any[]): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp.filter(
        (m: { _id: any }) => userFavorites.indexOf(m._id) >= 0
      );
    });
  }

  /**
   * edits the user's account info in the api
   */
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      console.log(result);
      this.snackBar.open('User profile was successfuly updated', 'OK', {
        duration: 4000,
      });
      localStorage.setItem('user', result.Username);
      window.location.reload();
    });
  }

  /**
   * deletes the user's account and all info
   */
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(
      (result) => {
        localStorage.clear();
        this.router.navigate(['welcome']);
        this.snackBar.open('User successfully deleted', 'OK', {
          duration: 2000,
        });
        localStorage.clear();
        this.router.navigate(['/welcome']).then(() => {
          window.location.reload();
        });
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
        this.router.navigate(['/welcome']).then(() => {
          window.location.reload();
        });
      }
    );
  }
}
