using HospitalManagementMvc.Data;
using HospitalManagementMvc.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementMvc.Controllers;

public class PatientsController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index() => View(await db.Patients.Include(p => p.Appointments).AsNoTracking().ToListAsync());
    public async Task<IActionResult> Details(int? id) { if (id is null) return NotFound(); var item = await db.Patients.Include(p => p.Appointments).ThenInclude(a => a.Doctor).FirstOrDefaultAsync(p => p.Id == id); return item is null ? NotFound() : View(item); }
    public IActionResult Create() => View();
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Name,RegistrationDate")] Patient patient) { if (!ModelState.IsValid) return View(patient); db.Add(patient); await db.SaveChangesAsync(); TempData["Success"] = "Patient created."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Edit(int? id) { if (id is null) return NotFound(); var item = await db.Patients.FindAsync(id); return item is null ? NotFound() : View(item); }
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,Name,RegistrationDate")] Patient patient) { if (id != patient.Id) return NotFound(); if (!ModelState.IsValid) return View(patient); db.Update(patient); await db.SaveChangesAsync(); TempData["Success"] = "Patient updated."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Delete(int? id) { if (id is null) return NotFound(); var item = await db.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id); return item is null ? NotFound() : View(item); }
    [HttpPost, ActionName("Delete"), ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id) { var item = await db.Patients.FindAsync(id); if (item is null) return NotFound(); db.Patients.Remove(item); await db.SaveChangesAsync(); TempData["Success"] = "Patient deleted."; return RedirectToAction(nameof(Index)); }
}