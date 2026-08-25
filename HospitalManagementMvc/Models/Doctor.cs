using System.ComponentModel.DataAnnotations;

namespace HospitalManagementMvc.Models;

public class Doctor
{
    public int Id { get; set; }
    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;
    [Display(Name = "Department")]
    public int DepartmentId { get; set; }
    public Department? Department { get; set; }
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}