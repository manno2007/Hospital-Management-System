using HospitalManagementMvc.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementMvc.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Doctor>()
            .HasOne(d => d.Department).WithMany(d => d.Doctors)
            .HasForeignKey(d => d.DepartmentId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Patient).WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PatientId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Doctor).WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DoctorId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Cardiology" },
            new Department { Id = 2, Name = "Neurology" },
            new Department { Id = 3, Name = "Pediatrics" });
        modelBuilder.Entity<Doctor>().HasData(
            new Doctor { Id = 1, Name = "Dr. Maya Hassan", DepartmentId = 1 },
            new Doctor { Id = 2, Name = "Dr. Lina Farouk", DepartmentId = 2 },
            new Doctor { Id = 3, Name = "Dr. Youssef Adel", DepartmentId = 3 });
        modelBuilder.Entity<Patient>().HasData(
            new Patient { Id = 1, Name = "Nour El-Sayed", RegistrationDate = new DateTime(2026, 8, 8) },
            new Patient { Id = 2, Name = "Adam Mostafa", RegistrationDate = new DateTime(2026, 8, 14) });
        modelBuilder.Entity<Appointment>().HasData(
            new Appointment { Id = 1, AppointmentDate = new DateTime(2026, 8, 24, 9, 0, 0), Description = "Routine cardiac follow-up", PatientId = 1, DoctorId = 1 },
            new Appointment { Id = 2, AppointmentDate = new DateTime(2026, 8, 24, 10, 30, 0), Description = "Pediatric wellness check", PatientId = 2, DoctorId = 3 });
    }
}