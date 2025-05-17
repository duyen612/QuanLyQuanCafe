import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; 
import { ReservationService } from '../../../services/reservation.service'; 

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  isLoggedIn = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(value => {
      this.isLoggedIn = value;
    });

    this.userId = (this.authService as AuthService).getUserId();

    this.reservationForm = this.fb.group({
      name: [this.isLoggedIn ? '' : '', this.isLoggedIn ? [] : [Validators.required, Validators.minLength(3)]],
      email: [this.isLoggedIn ? '' : '', this.isLoggedIn ? [] : [Validators.required, Validators.email]],
      phone: [this.isLoggedIn ? '' : '', this.isLoggedIn ? [] : [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      reservationDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
      if (this.isLoggedIn && this.userId) {
        reservationData.userId = this.userId;
      }

      console.log('Dữ liệu gửi đi:', reservationData);
      this.reservationService.createReservation(reservationData).subscribe(response => {
        console.log('Đặt bàn thành công:', response);
      });
    }
  }
}
