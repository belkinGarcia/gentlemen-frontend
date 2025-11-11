import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'role'];
  dataSource: User[] = [];
  private userSub: Subscription | undefined;
  currentAdminId: number | null = null;
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentAdminId = currentUser.id;
    }
    this.userSub = this.userService.getUsers().subscribe(users => {
      this.dataSource = users;
    });
  }
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
  /**
   * Se llama cuando el admin cambia el rol en el dropdown
   */
  onRoleChange(user: User, newRole: 'USER' | 'ADMIN'): void {
    console.log(`Cambiando rol de ${user.email} a ${newRole}`);
    this.userService.updateUserRole(user.id, newRole);
  }
}