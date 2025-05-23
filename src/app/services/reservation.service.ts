import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/reservations'; // Đổi thành URL thực tế backend

  constructor(private http: HttpClient) {}

  // Tạo mới một đặt bàn
  createReservation(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/reservations', data);
  }
  // Lấy danh sách tất cả đặt bàn (cho admin)
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  // Lấy danh sách đặt bàn theo userId
  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Lấy chi tiết một đặt bàn
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  // Cập nhật đặt bàn (ví dụ admin xác nhận hoặc hủy)
  updateReservation(id: number, reservation: Reservation): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, reservation);
  }

  // Hủy đặt bàn
  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
