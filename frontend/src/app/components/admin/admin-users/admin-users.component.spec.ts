import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersComponent } from './admin-users.component';
import { AdminService } from '../../services/admin.service';
import { of, throwError } from 'rxjs';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let adminService: jasmine.SpyObj<AdminService>;

  const mockUsers = [
    {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      address: '123 Test St',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      username: 'adminuser',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      address: '456 Admin St',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const adminServiceSpy = jasmine.createSpyObj('AdminService', ['getAllUsers', 'updateUserRole']);
    
    await TestBed.configureTestingModule({
      declarations: [ AdminUsersComponent ],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    }).compileComponents();
    
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    adminService.getAllUsers.and.returnValue(of(mockUsers));
    
    component.ngOnInit();
    
    expect(adminService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should handle error when loading users', () => {
    const errorMessage = 'Failed to load users';
    adminService.getAllUsers.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.ngOnInit();
    
    expect(component.error).toBeTrue();
    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBeFalse();
  });

  it('should update user role', () => {
    const userId = 1;
    const newRole = 'ADMIN';
    adminService.updateUserRole.and.returnValue(of({ ...mockUsers[0], role: newRole }));
    
    component.updateUserRole(userId, newRole);
    
    expect(adminService.updateUserRole).toHaveBeenCalledWith(userId, newRole);
    expect(component.users[0].role).toBe(newRole);
  });

  it('should handle error when updating user role', () => {
    const userId = 1;
    const newRole = 'ADMIN';
    const errorMessage = 'Failed to update role';
    adminService.updateUserRole.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.updateUserRole(userId, newRole);
    
    expect(component.error).toBeTrue();
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should show user details', () => {
    const user = mockUsers[0];
    
    component.viewUserDetails(user);
    
    expect(component.selectedUser).toEqual(user);
  });

  it('should close user details', () => {
    component.selectedUser = mockUsers[0];
    
    component.closeUserDetails();
    
    expect(component.selectedUser).toBeNull();
  });

  it('should refresh users', () => {
    adminService.getAllUsers.and.returnValue(of(mockUsers));
    
    component.loadUsers();
    
    expect(adminService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeFalse();
  });
}); 