import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   *
   * @param {HttpClient} _http
   */
  public churcesData: any;
  public status: any = false;

  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll() {
    return this._http.get<User[]>(`${environment.apiUrl}/users`);
  }

  /**
   * Get user by id
   */
  getById(id: number) {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
  getData() {

    return this._http.get<any>(environment.apiUrl+'api/get_churches_for_visitor').subscribe(
      (res: any) => {
        if (res === "nonet") {
          return [];
          // Handle 'nonet' response if needed
        } else {
          if (res.status === false) {
            return [];
            // Handle false status if needed
          } else if (res.status === true) {
            this.churcesData = res.data;
            console.log("churches11 data",this.churcesData);
           return this.churcesData;
          }
        }
      },
      (error: any) => {
        // Handle error if needed
      }
    );

    // let request = {
    //   params: null,
    //   action_url: "get_churches",
    //   method: "GET",
    // };
    // this.httpService.doHttp(request).subscribe(
    //   (res: any) => {
    //     if (res == "nonet") {
    //     } else {
    //       if (res.status == false) {
    //       } else if (res.status == true) {
    //         this.churcesData = res.data;
    //         this.status = true;
    //       }
    //     }
    //   },
    //   (error: any) => {}
    // );
  }

}
