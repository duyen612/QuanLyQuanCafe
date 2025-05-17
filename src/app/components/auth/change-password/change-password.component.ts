import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  username: string = '';


  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {
    this.username = this.authService.getCurrentUsername();
  }
  onSubmit() {
    if (!this.username) {
      this.message = 'Không xác định được tài khoản!';
      return;
    }
    this.authService.getUserByUsername(this.username).subscribe(users => {
      const user = users[0];

      if (!user || user.password !== this.oldPassword) {
        this.message = 'Mật khẩu cũ không đúng!';
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.message = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
        return;
      }

      if (this.newPassword.length < 6) {
        this.message = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
        return;
      }

      // Cập nhật mật khẩu trong db.json
      const updatedUser = { ...user, password: this.newPassword };
      this.authService.updateUser(user.id, updatedUser).subscribe(() => {
        this.message = 'Đổi mật khẩu thành công!';
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.message = '';
        }, 1000);
      });
    });
  }
}