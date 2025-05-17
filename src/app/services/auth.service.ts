import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>('');
  private currentUserId: number | null = null;
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }


  // Gọi sau khi đăng nhập thành công
  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(users => {
      const user = users.length > 0 ? users[0] : null;
      if (user) {
        localStorage.setItem('username', user.username); // ✅ Thêm dòng này
      }
      return user;
    })
    );
  }




  // Lấy trạng thái đăng nhập
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // ✅ Hàm trả về userId hiện tại
  getUserId(): number | null {
    return this.currentUserId;
  }

  // Optional: Đăng xuất
  logout(): void {
    this.usernameSubject.next('');
    this.loggedIn.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  }
  getUserByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`); // Use the correct apiUrl
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user); // Use the correct apiUrl
  }
  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
  getCurrentUsername(): string {
    return localStorage.getItem('username') || '';
  }

}

