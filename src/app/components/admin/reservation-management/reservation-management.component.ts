import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/reservation';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css']
})
export class ReservationManagementComponent implements OnInit {
  reservations: Reservation[] = [];
  isAdmin: boolean = false; // Thay bằng logic kiểm tra role thực tế
  userId: number | null = null; // Thay bằng userId từ auth service
  errorMessage: string = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    // Giả lập kiểm tra role và userId, thay bằng logic thực tế
    this.isAdmin = localStorage.getItem('role') === 'admin';
    this.userId = Number(localStorage.getItem('userId')) ;

    this.loadReservations();
  }

  loadReservations(): void {
    let reservationObservable: Observable<any[]>;

    if (this.isAdmin) {
      reservationObservable = this.reservationService.getAllReservations();
    } else if (this.userId) {
      reservationObservable = this.reservationService.getReservationsByUser(this.userId);
    } else {
      this.errorMessage = 'Không thể tải danh sách đặt bàn. Vui lòng đăng nhập lại.';
      return;
    }

    reservationObservable.subscribe({
      next: (data) => {
        // Chuyển đổi dữ liệu về đúng kiểu Reservation
        this.reservations = data.map(item => ({
          id: item.id,
          fullName: item.fullName || item.name || 'N/A',
          phoneNumber: item.phone || 'N/A',
          numberOfGuests: item.numberOfGuests || item.guests || 1,
          reservationTime: item.reservationTime
            ? new Date(item.reservationTime)
            : new Date(`${item.reservationDate}T${item.timeSlot}`),
          status: item.status || 'pending',
        }));
      },
      error: (error) => {
        this.errorMessage = 'Lỗi khi tải danh sách đặt bàn: ' + error.message;
      }
    });
  }


  confirmReservation(id: number): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Chỉ admin mới có thể xác nhận đặt bàn.';
      return;
    }
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải dữ liệu đặt bàn.';
      }
    });

    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        reservation.status = 'confirmed'; // Giả sử có trường status
        this.reservationService.updateReservation(id, reservation).subscribe({
          next: () => {
            this.loadReservations(); // Tải lại danh sách
            alert('Xác nhận đặt bàn thành công!');
          },
          error: (error) => {
            this.errorMessage = 'Lỗi khi xác nhận đặt bàn: ' + error.message;
          }
        });
      }
    });
  }

  cancelReservation(id: number): void {
    if (confirm('Bạn có chắc muốn hủy đặt bàn này?')) {
      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          this.loadReservations(); // Tải lại danh sách
          alert('Hủy đặt bàn thành công!');
        },
        error: (error) => {
          this.errorMessage = 'Lỗi khi hủy đặt bàn: ' + error.message;
        }
      });
    }
  }
}
