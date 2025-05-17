import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user: User = { username: '', email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, public router: Router) {}

  register() {
    if (!this.user.username || !this.user.email || !this.user.password) {//Kiểm tra nếu thiếu thông tin → hiển thị lỗi
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin!';
      return;
    }
    this.authService
      .getUserByUsername(this.user.username)
      .subscribe((users) => {// Kiểm tra xem username đã tồn tại chưa
        if (users.length > 0) {//Nếu đã có user trùng tên, báo lỗi
          this.errorMessage = 'Email đã tồn tại!';
          return;
        }

        this.authService.registerUser(this.user).subscribe({//lưu người dùng mới
          next: (res) => {
            alert('Đăng ký thành công!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.log('Lỗi đăng ký:', err);
            this.errorMessage = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!';
          },
        });
      });
  }
}
