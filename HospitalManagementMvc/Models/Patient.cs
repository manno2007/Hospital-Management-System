using System.ComponentModel.DataAnnotations;

namespace HospitalManagementMvc.Models;

public class Patient
{
    public int Id { get; set; }
    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;
    [DataType(DataType.Date), Display(Name = "Registration date")]
    public DateTime RegistrationDate { get; set; } = DateTime.Today;
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}