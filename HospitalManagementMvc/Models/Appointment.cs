using System.ComponentModel.DataAnnotations;

namespace HospitalManagementMvc.Models;

public class Appointment
{
    public int Id { get; set; }
    [Display(Name = "Appointment date")]
    public DateTime AppointmentDate { get; set; }
    [Required, StringLength(500)]
    [Display(Name = "Diagnosis / description")]
    public string Description { get; set; } = string.Empty;
    [Display(Name = "Patient")]
    public int PatientId { get; set; }
    public Patient? Patient { get; set; }
    [Display(Name = "Doctor")]
    public int DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
}