using System.ComponentModel.DataAnnotations;

namespace HospitalManagementMvc.Models;

public class Department
{
    public int Id { get; set; }
    [Required, StringLength(100)]
    [Display(Name = "Department name")]
    public string Name { get; set; } = string.Empty;
    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}