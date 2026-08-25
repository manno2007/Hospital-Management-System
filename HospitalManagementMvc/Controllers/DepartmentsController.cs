using HospitalManagementMvc.Data;
using HospitalManagementMvc.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementMvc.Controllers;

public class DepartmentsController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index() => View(await db.Departments.Include(d => d.Doctors).AsNoTracking().ToListAsync());
    public async Task<IActionResult> Details(int? id) { if (id is null) return NotFound(); var item = await db.Departments.Include(d => d.Doctors).FirstOrDefaultAsync(d => d.Id == id); return item is null ? NotFound() : View(item); }
    public IActionResult Create() => View();
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Name")] Department department) { if (!ModelState.IsValid) return View(department); db.Add(department); await db.SaveChangesAsync(); TempData["Success"] = "Department created."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Edit(int? id) { if (id is null) return NotFound(); var item = await db.Departments.FindAsync(id); return item is null ? NotFound() : View(item); }
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,Name")] Department department) { if (id != department.Id) return NotFound(); if (!ModelState.IsValid) return View(department); db.Update(department); await db.SaveChangesAsync(); TempData["Success"] = "Department updated."; return RedirectToAction(nameof(Index)); }
    public async Task<IActionResult> Delete(int? id) { if (id is null) return NotFound(); var item = await db.Departments.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id); return item is null ? NotFound() : View(item); }
    [HttpPost, ActionName("Delete"), ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id) { var item = await db.Departments.FindAsync(id); if (item is null) return NotFound(); db.Departments.Remove(item); await db.SaveChangesAsync(); TempData["Success"] = "Department deleted."; return RedirectToAction(nameof(Index)); }
}