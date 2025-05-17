import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, public router: Router) {}

  onLogin() {
    this.authService.getUserByUsername(this.username).subscribe((users) => {
      //Gọi API (hoặc lấy từ dữ liệu giả) để tìm người dùng theo username
      const user = users.find((u) => u.password === this.password);
      //Tìm user trong danh sách đó có mật khẩu trùng khớp
      if (!user) {
        this.errorMessage = 'Sai thông tin đăng nhập!';
        return;
      }

      alert('Đăng nhập thành công!');
      localStorage.setItem('username', user.username); // Lưu vào localStorage
      this.authService.login(user.username, user.password); // lưu trạng thái đăng nhập
      this.router.navigate(['/home']);// Chuyển sang trang danh sách cổ phiếu
    });
  }
}
