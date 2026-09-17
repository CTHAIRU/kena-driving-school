"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Plus,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Gauge,
  X,
  ShieldCheck,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeh, setEditingVeh] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    registrationPlate: "",
    transmission: "MANUAL",
    category: "Hatchback",
    status: "AVAILABLE",
    mileage: 0,
    insuranceExpiry: "",
    inspectionExpiry: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [newVeh, setNewVeh] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    registrationPlate: "",
    transmission: "MANUAL",
    category: "Hatchback",
    mileage: 0,
    insuranceExpiry: "",
    inspectionExpiry: "",
  });

  const handleStartEdit = (veh: any) => {
    setEditingVeh(veh);
    setEditForm({
      make: veh.make || "",
      model: veh.model || "",
      year: veh.year || new Date().getFullYear(),
      registrationPlate: veh.registrationPlate || "",
      transmission: veh.transmission || "MANUAL",
      category: veh.category || "Hatchback",
      status: veh.status || "AVAILABLE",
      mileage: veh.mileage || 0,
      insuranceExpiry: veh.insuranceExpiry ? veh.insuranceExpiry.slice(0, 10) : "",
      inspectionExpiry: veh.inspectionExpiry ? veh.inspectionExpiry.slice(0, 10) : "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        ...editForm,
        year: parseInt(String(editForm.year)) || 2022,
        mileage: parseInt(String(editForm.mileage)) || 0,
      };
      if (editForm.insuranceExpiry) payload.insuranceExpiry = new Date(editForm.insuranceExpiry);
      if (editForm.inspectionExpiry) payload.inspectionExpiry = new Date(editForm.inspectionExpiry);

      const res = await fetch(`/api/vehicles/${editingVeh.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingVeh(null);
        fetchVehicles();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string, plate: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove vehicle "${plate}" from the fleet? Assigned instructors and lessons will be unlinked safely.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchVehicles();
      } else {
        alert("Failed to remove vehicle");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVeh),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register vehicle");
      }

      setIsModalOpen(false);
      setNewVeh({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        registrationPlate: "",
        transmission: "MANUAL",
        category: "Hatchback",
        mileage: 0,
        insuranceExpiry: "",
        inspectionExpiry: "",
      });
      fetchVehicles();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await fetch("/api/vehicles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchVehicles();
    } catch (e) {
      console.error(e);
    }
  };

  const isExpiringSoon = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 60;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet & Dual-Control Vehicles</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Monitor vehicle maintenance, safety inspections, insurance validity, and lesson assignments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Fleet Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading fleet...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => {
            const inspAlert = isExpiringSoon(v.inspectionExpiry);
            const insAlert = isExpiringSoon(v.insuranceExpiry);

            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">
                          {v.make} {v.model}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {v.year}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-blue-600 mt-1">
                        {v.registrationPlate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusUpdate(v.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          v.status === "AVAILABLE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : v.status === "MAINTENANCE"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="IN_SERVICE">In Service</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                      <button
                        onClick={() => handleStartEdit(v)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(v.id, v.registrationPlate)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                        v.transmission === "MANUAL"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-cyan-50 text-cyan-700 border-cyan-200"
                      }`}
                    >
                      {v.transmission}
                    </span>
                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                      {v.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      <Gauge className="w-3.5 h-3.5" />
                      {v.mileage.toLocaleString()} km
                    </span>
                  </div>

                  {/* Compliance Cards */}
                  <div className="mt-5 space-y-2 text-xs">
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        inspAlert
                          ? "bg-amber-50/80 border-amber-200 text-amber-900"
                          : "bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        {inspAlert && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                        Safety Inspection
                      </span>
                      <span className="font-semibold">{formatDate(v.inspectionExpiry)}</span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        insAlert
                          ? "bg-amber-50/80 border-amber-200 text-amber-900"
                          : "bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        {insAlert && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                        Insurance Cover
                      </span>
                      <span className="font-semibold">{formatDate(v.insuranceExpiry)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{v._count?.lessons || 0} total lessons conducted</span>
                  {v.lastServiceDate && <span>Serviced: {formatDate(v.lastServiceDate)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add Fleet Vehicle</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateVehicle} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota"
                    value={newVeh.make}
                    onChange={(e) => setNewVeh({ ...newVeh, make: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yaris Dual-Control"
                    value={newVeh.model}
                    onChange={(e) => setNewVeh({ ...newVeh, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KDA 102B"
                    value={newVeh.registrationPlate}
                    onChange={(e) => setNewVeh({ ...newVeh, registrationPlate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={newVeh.year}
                    onChange={(e) => setNewVeh({ ...newVeh, year: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Transmission *</label>
                  <select
                    value={newVeh.transmission}
                    onChange={(e) => setNewVeh({ ...newVeh, transmission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newVeh.category}
                    onChange={(e) => setNewVeh({ ...newVeh, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Commercial Truck">Commercial Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Safety Inspection Expiry *</label>
                  <input
                    type="date"
                    required
                    value={newVeh.inspectionExpiry}
                    onChange={(e) => setNewVeh({ ...newVeh, inspectionExpiry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Insurance Expiry *</label>
                  <input
                    type="date"
                    required
                    value={newVeh.insuranceExpiry}
                    onChange={(e) => setNewVeh({ ...newVeh, insuranceExpiry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Vehicle Modal */}
      {editingVeh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Edit Fleet Vehicle: {editingVeh.make} {editingVeh.model}
                </h3>
                <p className="text-xs text-slate-500">
                  Update vehicle registration plate, transmission, status, and compliance dates.
                </p>
              </div>
              <button
                onClick={() => setEditingVeh(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    value={editForm.make}
                    onChange={(e) => setEditForm({ ...editForm, make: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year of Manufacture</label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={editForm.registrationPlate}
                    onChange={(e) => setEditForm({ ...editForm, registrationPlate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={editForm.transmission}
                    onChange={(e) => setEditForm({ ...editForm, transmission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Pickup / Commercial">Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="IN_SERVICE">In Service</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    value={editForm.mileage}
                    onChange={(e) => setEditForm({ ...editForm, mileage: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inspection Expiry</label>
                  <input
                    type="date"
                    value={editForm.inspectionExpiry}
                    onChange={(e) => setEditForm({ ...editForm, inspectionExpiry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Insurance Expiry</label>
                  <input
                    type="date"
                    value={editForm.insuranceExpiry}
                    onChange={(e) => setEditForm({ ...editForm, insuranceExpiry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVeh(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Vehicle Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
