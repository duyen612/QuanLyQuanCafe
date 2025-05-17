import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  userId: string = '';
  apiUrl = 'http://localhost:3000/users';
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      role: ['staff', Validators.required],
      startDate: ['', Validators.required],
    });

  const username = localStorage.getItem('username') || '';
    if (username) {
      this.http.get<any[]>(`${this.apiUrl}?username=${username}`).subscribe(users => {
        const user = users[0];
        if (user) {
          this.userId = user.id;// <-- Cần đảm bảo dòng này lấy đúng 1 id duy nhất!
          this.profileForm.patchValue({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'staff',
            startDate: user.startDate || ''
          });
        }
      });
    }
  }

  onSubmitPersonalInfo(): void {
    console.log('Gửi form');
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;
      console.log('Form hợp lệ, userId:', this.userId, 'Dữ liệu gửi:', profileData);

      this.http.put(`${this.apiUrl}/${this.userId}`, {
      ...profileData,
      username: localStorage.getItem('username') || ''
    }).subscribe({
      next: () => {
        alert('Cập nhật thông tin thành công!');
      },
      error: (err) => {
        console.error('Lỗi PUT:', err); // <--- thêm dòng này để debug
        alert('Lỗi khi cập nhật thông tin, vui lòng thử lại.');
      }
    });

    } else {
      console.warn('Form thông tin cá nhân không hợp lệ');
    }
  }


}
