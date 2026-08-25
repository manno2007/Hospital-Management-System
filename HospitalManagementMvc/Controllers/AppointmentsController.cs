using HospitalManagementMvc.Data;
using HospitalManagementMvc.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementMvc.Controllers;

public class AppointmentsController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index() => View(await db.Appointments.Include(a => a.Patient).Include(a => a.Doctor).ThenInclude(d => d!.Department).AsNoTracking().OrderBy(a => a.AppointmentDate).ToListAsync());
    public async Task<IActionResult> Details(int? id) { if (id is null) return NotFound(); var item = await db.Appointments.Include(a => a.Patient).Include(a => a.Doctor).ThenInclude(d => d!.Department).FirstOrDefaultAsync(a => a.Id == id); return item is null ? NotFound() : View(item); }
    public async Task<IActionResult> Create() { await LoadDropdowns(); return View(); }
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("AppointmentDate,Description,PatientId,DoctorId")] Appointment appointment) { if (!ModelState.IsValid) { await LoadDropdowns(); return View(appointment); } db.Add(appointment); await db.SaveChangesAsync(); TempData["Success"] = "Appointment scheduled."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Edit(int? id) { if (id is null) return NotFound(); var item = await db.Appointments.FindAsync(id); if (item is null) return NotFound(); await LoadDropdowns(); return View(item); }
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,AppointmentDate,Description,PatientId,DoctorId")] Appointment appointment) { if (id != appointment.Id) return NotFound(); if (!ModelState.IsValid) { await LoadDropdowns(); return View(appointment); } db.Update(appointment); await db.SaveChangesAsync(); TempData["Success"] = "Appointment updated."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Delete(int? id) { if (id is null) return NotFound(); var item = await db.Appointments.Include(a => a.Patient).Include(a => a.Doctor).AsNoTracking().FirstOrDefaultAsync(a => a.Id == id); return item is null ? NotFound() : View(item); }
    [HttpPost, ActionName("Delete"), ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id) { var item = await db.Appointments.FindAsync(id); if (item is null) return NotFound(); db.Appointments.Remove(item); await db.SaveChangesAsync(); TempData["Success"] = "Appointment deleted."; return RedirectToAction(nameof(Index)); }
    private async Task LoadDropdowns() { ViewBag.PatientId = new SelectList(await db.Patients.AsNoTracking().ToListAsync(), "Id", "Name"); ViewBag.DoctorId = new SelectList(await db.Doctors.AsNoTracking().ToListAsync(), "Id", "Name"); }
}