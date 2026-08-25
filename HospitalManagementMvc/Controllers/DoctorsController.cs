using HospitalManagementMvc.Data;
using HospitalManagementMvc.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementMvc.Controllers;

public class DoctorsController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index() => View(await db.Doctors.Include(d => d.Department).AsNoTracking().ToListAsync());
    public async Task<IActionResult> Details(int? id) { if (id is null) return NotFound(); var item = await db.Doctors.Include(d => d.Department).Include(d => d.Appointments).ThenInclude(a => a.Patient).FirstOrDefaultAsync(d => d.Id == id); return item is null ? NotFound() : View(item); }
    public async Task<IActionResult> Create() { await LoadDepartments(); return View(); }
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Name,DepartmentId")] Doctor doctor) { if (!ModelState.IsValid) { await LoadDepartments(); return View(doctor); } db.Add(doctor); await db.SaveChangesAsync(); TempData["Success"] = "Doctor created."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Edit(int? id) { if (id is null) return NotFound(); var item = await db.Doctors.FindAsync(id); if (item is null) return NotFound(); await LoadDepartments(); return View(item); }
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,Name,DepartmentId")] Doctor doctor) { if (id != doctor.Id) return NotFound(); if (!ModelState.IsValid) { await LoadDepartments(); return View(doctor); } db.Update(doctor); await db.SaveChangesAsync(); TempData["Success"] = "Doctor updated."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Delete(int? id) { if (id is null) return NotFound(); var item = await db.Doctors.Include(d => d.Department).FirstOrDefaultAsync(d => d.Id == id); return item is null ? NotFound() : View(item); }
    [HttpPost, ActionName("Delete"), ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id) { var item = await db.Doctors.FindAsync(id); if (item is null) return NotFound(); db.Doctors.Remove(item); await db.SaveChangesAsync(); TempData["Success"] = "Doctor deleted."; return RedirectToAction(nameof(Index)); }
    private async Task LoadDepartments() => ViewBag.DepartmentId = new SelectList(await db.Departments.AsNoTracking().ToListAsync(), "Id", "Name");
}