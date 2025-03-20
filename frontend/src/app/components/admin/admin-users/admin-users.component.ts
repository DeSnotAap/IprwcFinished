import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  error = false;
  errorMessage = '';
  selectedUser: any = null;
  editMode = false;
  userForm: FormGroup;
  updateSuccess = false;
  updateError = false;
  updateErrorMessage = '';
  roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' }
  ];
  
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      firstName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      address: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = false;
    
    this.adminService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.error = true;
        this.errorMessage = 'Error loading users. Please try again.';
        console.error('Error loading users:', error);
      }
    );
  }

  viewUserDetails(user: any): void {
    this.selectedUser = user;
    this.editMode = false;
    this.updateSuccess = false;
    this.updateError = false;
  }

  closeUserDetails(): void {
    this.selectedUser = null;
    this.editMode = false;
    this.updateSuccess = false;
    this.updateError = false;
  }

  updateUserRole(userId: number, role: string): void {
    // Method kept for reference, but no longer used
    console.log('Role editing has been disabled');
    /*
    this.adminService.updateUserRole(userId, { role }).subscribe(
      (data) => {
        // Update the user in the local array
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index].role = role;
        }
        // If we're viewing the details of this user, update that too
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser.role = role;
        }
      },
      (error) => {
        console.error('Error updating user role:', error);
      }
    );
    */
  }

  onRoleChange(event: Event, userId: number): void {
    // Method kept for reference, but no longer used
    console.log('Role editing has been disabled');
    /*
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.updateUserRole(userId, selectElement.value);
    }
    */
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe(
        () => {
          // Remove the user from the local array
          this.users = this.users.filter(user => user.id !== userId);
          
          // If we're viewing the details of this user, close the modal
          if (this.selectedUser && this.selectedUser.id === userId) {
            this.selectedUser = null;
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Could not delete user. Please try again.');
        }
      );
    }
  }

  editUserFromTable(user: any): void {
    this.selectedUser = user;
    this.editUserDetails();
  }

  editUserDetails(): void {
    if (!this.selectedUser) return;
    
    this.userForm.patchValue({
      username: this.selectedUser.username,
      firstName: this.selectedUser.firstName || '',
      lastName: this.selectedUser.lastName || '',
      address: this.selectedUser.address || ''
    });
    
    this.editMode = true;
    this.updateSuccess = false;
    this.updateError = false;
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  saveUserDetails(): void {
    if (this.userForm.invalid) return;
    
    const userData = {
      username: this.userForm.value.username,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      address: this.userForm.value.address
    };
    
    this.adminService.updateUserDetails(this.selectedUser.id, userData).subscribe(
      (response) => {
        // Update the user in the local array
        const index = this.users.findIndex(user => user.id === this.selectedUser.id);
        if (index !== -1) {
          this.users[index] = { 
            ...this.users[index], 
            ...userData 
          };
        }
        
        // Update the selected user details
        this.selectedUser = { 
          ...this.selectedUser, 
          ...userData 
        };
        
        this.editMode = false;
        this.updateSuccess = true;
        this.updateError = false;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      (error) => {
        console.error('Error updating user details:', error);
        this.updateError = true;
        this.updateErrorMessage = error.error?.message || 'Error updating user details. Please try again.';
      }
    );
  }
} 