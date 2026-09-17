"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Plus,
  Car,
  Star,
  Users,
  X,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Monitor,
  Sparkles,
  Check,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import { OFFICIAL_COMPUTER_TOPICS } from "@/lib/computerCurriculum";
import { OFFICIAL_AI_TOPICS } from "@/lib/aiCurriculum";

function InstructorsContent() {
  const searchParams = useSearchParams();
  const [instructors, setInstructors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab & search filters
  const [selectedTab, setSelectedTab] = useState<"ALL" | "DRIVING" | "COMPUTER" | "AI">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // New Instructor Form state
  const [newInst, setNewInst] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    category: "DRIVING", // DRIVING, COMPUTER, AI
    department: "Driving School",
    specializations: "Manual & Automatic",
    modulesTaught: [] as string[],
    labStation: "",
    certifications: "",
    assignedVehicleId: "",
    rating: 5.0,
  });

  // Edit Instructor Form state
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    category: "DRIVING",
    department: "Driving School",
    specializations: "",
    modulesTaught: [] as string[],
    labStation: "",
    certifications: "",
    assignedVehicleId: "",
    status: "ACTIVE",
    rating: 5.0,
  });

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/instructors");
      if (res.ok) {
        const data = await res.json();
        setInstructors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch instructors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      if (res.ok) {
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchVehicles();
  }, []);

  // Auto-open modal if ?action=new is provided in URL
  useEffect(() => {
    const action = searchParams?.get("action");
    if (action === "new") {
      setIsModalOpen(true);
      const cat = searchParams?.get("category");
      if (cat && ["DRIVING", "COMPUTER", "AI"].includes(cat.toUpperCase())) {
        handleCategorySwitch(cat.toUpperCase());
      }
    }
  }, [searchParams]);

  const handleCategorySwitch = (cat: string) => {
    let dept = "Driving School";
    let defaultSpec = "Manual & Automatic";
    let licensePlaceholder = "";

    if (cat === "COMPUTER") {
      dept = "Computer College";
      defaultSpec = "MS Office Suite, OS & Hardware Maintenance";
      licensePlaceholder = `KENA-COMP-TTR-0${instructors.filter((i) => i.category === "COMPUTER").length + 1}`;
    } else if (cat === "AI") {
      dept = "Modern AI Academy";
      defaultSpec = "LLMs, Prompt Engineering, Multimedia AI & Freelancing";
      licensePlaceholder = `KENA-AI-TTR-0${instructors.filter((i) => i.category === "AI").length + 1}`;
    } else {
      defaultSpec = "Manual, Automatic & Town Board";
      licensePlaceholder = "NTSA-INS-";
    }

    setNewInst((prev) => ({
      ...prev,
      category: cat,
      department: dept,
      specializations: defaultSpec,
      licenseNumber: licensePlaceholder,
      assignedVehicleId: "",
      modulesTaught:
        cat === "COMPUTER"
          ? ["MS Word", "MS Excel", "MS PowerPoint", "Introduction to computers"]
          : cat === "AI"
          ? ["Introduction to AI & its basic", "AI models ;Chatgpt, Gemini Etc.", "Prompt engineering"]
          : [],
    }));
  };

  const toggleModuleSelection = (moduleTitle: string, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => {
        const exists = prev.modulesTaught.includes(moduleTitle);
        const updated = exists
          ? prev.modulesTaught.filter((m) => m !== moduleTitle)
          : [...prev.modulesTaught, moduleTitle];
        return { ...prev, modulesTaught: updated };
      });
    } else {
      setNewInst((prev) => {
        const exists = prev.modulesTaught.includes(moduleTitle);
        const updated = exists
          ? prev.modulesTaught.filter((m) => m !== moduleTitle)
          : [...prev.modulesTaught, moduleTitle];
        return { ...prev, modulesTaught: updated };
      });
    }
  };

  const selectAllModules = (type: "COMPUTER" | "AI", isEdit = false) => {
    const allTitles =
      type === "COMPUTER"
        ? OFFICIAL_COMPUTER_TOPICS.map((t) => t.title)
        : OFFICIAL_AI_TOPICS.map((t) => t.title);

    if (isEdit) {
      setEditForm((prev) => ({ ...prev, modulesTaught: allTitles }));
    } else {
      setNewInst((prev) => ({ ...prev, modulesTaught: allTitles }));
    }
  };

  const clearAllModules = (isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({ ...prev, modulesTaught: [] }));
    } else {
      setNewInst((prev) => ({ ...prev, modulesTaught: [] }));
    }
  };

  const handleCreateInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const payload = {
        firstName: newInst.firstName.trim(),
        lastName: newInst.lastName.trim(),
        email: newInst.email.trim(),
        phone: newInst.phone.trim(),
        licenseNumber: newInst.licenseNumber.trim(),
        category: newInst.category,
        department: newInst.department,
        specializations: newInst.specializations,
        modulesTaught: newInst.modulesTaught.join(", "),
        labStation: newInst.labStation,
        certifications: newInst.certifications,
        assignedVehicleId: newInst.category === "DRIVING" && newInst.assignedVehicleId ? newInst.assignedVehicleId : null,
        rating: Number(newInst.rating) || 5.0,
      };

      const res = await fetch("/api/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create faculty member");
        return;
      }

      setIsModalOpen(false);
      setNewInst({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        category: "DRIVING",
        department: "Driving School",
        specializations: "Manual & Automatic",
        modulesTaught: [],
        labStation: "",
        certifications: "",
        assignedVehicleId: "",
        rating: 5.0,
      });
      fetchInstructors();
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (inst: any) => {
    setEditingInst(inst);
    const parsedModules = inst.modulesTaught
      ? inst.modulesTaught.split(",").map((m: string) => m.trim()).filter(Boolean)
      : [];

    setEditForm({
      firstName: inst.firstName || "",
      lastName: inst.lastName || "",
      email: inst.email || "",
      phone: inst.phone || "",
      licenseNumber: inst.licenseNumber || "",
      category: inst.category || "DRIVING",
      department:
        inst.department ||
        (inst.category === "COMPUTER"
          ? "Computer College"
          : inst.category === "AI"
          ? "Modern AI Academy"
          : "Driving School"),
      specializations: inst.specializations || "",
      modulesTaught: parsedModules,
      labStation: inst.labStation || "",
      certifications: inst.certifications || "",
      assignedVehicleId: inst.assignedVehicleId || "",
      status: inst.status || "ACTIVE",
      rating: inst.rating || 5.0,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst) return;
    setSubmitting(true);
    try {
      const payload = {
        ...editForm,
        modulesTaught: editForm.modulesTaught.join(", "),
      };

      const res = await fetch(`/api/instructors/${editingInst.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingInst(null);
        fetchInstructors();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update faculty member");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving faculty member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInstructor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove faculty member "${name}"? This will unlink assigned students and lessons.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/instructors/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchInstructors();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete instructor");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting instructor");
    }
  };

  // Filtered instructors based on tab and search
  const filteredInstructors = instructors.filter((inst) => {
    const matchesTab =
      selectedTab === "ALL" ||
      (selectedTab === "DRIVING" && (inst.category === "DRIVING" || !inst.category)) ||
      inst.category === selectedTab;

    const query = searchQuery.toLowerCase();
    const fullName = `${inst.firstName || ""} ${inst.lastName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      (inst.email && inst.email.toLowerCase().includes(query)) ||
      (inst.licenseNumber && inst.licenseNumber.toLowerCase().includes(query)) ||
      (inst.specializations && inst.specializations.toLowerCase().includes(query)) ||
      (inst.modulesTaught && inst.modulesTaught.toLowerCase().includes(query)) ||
      (inst.labStation && inst.labStation.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const drivingCount = instructors.filter((i) => i.category === "DRIVING" || !i.category).length;
  const computerCount = instructors.filter((i) => i.category === "COMPUTER").length;
  const aiCount = instructors.filter((i) => i.category === "AI").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty &amp; Tutors</h1>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
              {instructors.length} Total Faculty
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified Driving Instructors, Computer College Tutors, and Modern AI Faculty.
          </p>
        </div>

        <button
          onClick={() => {
            handleCategorySwitch("DRIVING");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instructor / Tutor</span>
        </button>
      </div>

      {/* 3 Department Quick Action Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Driving */}
        <div
          onClick={() => setSelectedTab("DRIVING")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            selectedTab === "DRIVING"
              ? "bg-orange-50/80 border-orange-300 ring-2 ring-orange-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-orange-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" /> Driving School
            </span>
            <span className="text-base font-black text-orange-700">{drivingCount}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">Driving Instructors</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            NTSA-licensed instructors for manual, automatic, and town board roadcraft.
          </p>
        </div>

        {/* Computer */}
        <div
          onClick={() => setSelectedTab("COMPUTER")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            selectedTab === "COMPUTER"
              ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" /> Computer College
            </span>
            <span className="text-base font-black text-blue-700">{computerCount}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">Computer Tutors</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            10 Computer Modules: MS Office, Hardware, Windows, Internet &amp; Maintenance.
          </p>
        </div>

        {/* AI */}
        <div
          onClick={() => setSelectedTab("AI")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            selectedTab === "AI"
              ? "bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Modern AI Academy
            </span>
            <span className="text-base font-black text-purple-700">{aiCount}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">AI Tutors</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            9 Applied Topics: ChatGPT, Gemini, Prompt Engineering &amp; Monetization.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedTab("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedTab === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Faculty ({instructors.length})
          </button>
          <button
            onClick={() => setSelectedTab("DRIVING")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedTab === "DRIVING"
                ? "bg-white text-orange-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="w-3.5 h-3.5 text-orange-600" /> Driving ({drivingCount})
          </button>
          <button
            onClick={() => setSelectedTab("COMPUTER")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedTab === "COMPUTER"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-blue-600" /> Computer ({computerCount})
          </button>
          <button
            onClick={() => setSelectedTab("AI")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedTab === "AI"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI ({aiCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, modules, lab, staff ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Instructors & Tutors Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading faculty directory...</div>
      ) : filteredInstructors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
          No faculty members found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((inst) => {
            const isComputer = inst.category === "COMPUTER";
            const isAi = inst.category === "AI";
            const isDriving = !isComputer && !isAi;

            const categoryBadge = isComputer ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                <Monitor className="w-3.5 h-3.5" /> COMPUTER TUTOR
              </span>
            ) : isAi ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                <Sparkles className="w-3.5 h-3.5" /> AI TUTOR
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold">
                <Car className="w-3.5 h-3.5" /> DRIVING INSTRUCTOR
              </span>
            );

            const initialFirst = (inst.firstName?.[0] || "I").toUpperCase();
            const initialLast = (inst.lastName?.[0] || "").toUpperCase();

            const modulesList = inst.modulesTaught
              ? inst.modulesTaught.split(",").map((m: string) => m.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={inst.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl font-black text-sm flex items-center justify-center ${
                          isComputer
                            ? "bg-blue-100 text-blue-700"
                            : isAi
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {initialFirst}
                        {initialLast}
                      </div>
                      <div>
                        <div className="mb-1">{categoryBadge}</div>
                        <h3 className="font-bold text-base text-slate-900 leading-tight">
                          {inst.firstName} {inst.lastName}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {inst.licenseNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold mr-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{inst.rating || 5.0}</span>
                      </div>
                      <button
                        onClick={() => handleStartEdit(inst)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                        title="Edit Instructor / Tutor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteInstructor(inst.id, `${inst.firstName || ""} ${inst.lastName || ""}`)
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete / Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-3.5 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {inst.email || "No email"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {inst.phone || "No phone"}
                    </p>
                  </div>

                  {/* Department & Lab / Vehicle */}
                  <div className="mt-3 text-xs">
                    {isDriving ? (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          Primary Assigned Vehicle
                        </span>
                        {inst.vehicle ? (
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-orange-50/50 p-2 rounded-lg border border-orange-100">
                            <Car className="w-4 h-4 text-orange-600" />
                            <span>
                              {inst.vehicle.make} {inst.vehicle.model} ({inst.vehicle.registrationPlate})
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-lg">
                            No fixed vehicle assigned
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          Assigned Lab &amp; Station
                        </span>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {isComputer ? (
                            <Monitor className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          )}
                          <span>{inst.labStation || "Main College Workstation"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modules Taught / Topics */}
                  {modulesList.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Course Modules Taught
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {modulesList.map((mod: string, idx: number) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              isComputer
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : isAi
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : "bg-orange-50 text-orange-700 border border-orange-100"
                            }`}
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specializations & Certifications */}
                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Specialization &amp; Credentials
                    </span>
                    <p className="text-xs font-medium text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {inst.specializations || inst.certifications || "Standard Syllabus"}
                    </p>
                  </div>
                </div>

                {/* Bottom Student Load */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-800">{inst._count?.students || 0}</span>
                    <span>students enrolled</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {inst.department || "Faculty"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Instructor / Tutor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Add Faculty: {newInst.category === "COMPUTER" ? "Computer Tutor" : newInst.category === "AI" ? "Modern AI Tutor" : "Driving Instructor"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register teaching staff with dedicated credentials, course modules, and lab stations.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {formError}
              </div>
            )}

            {/* Role Selection Tabs */}
            <div className="mt-4">
              <label className="block font-bold text-slate-700 text-xs mb-1.5">
                Select Faculty Course / Role *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategorySwitch("DRIVING")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    newInst.category === "DRIVING"
                      ? "bg-orange-500 text-white border-orange-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Car className="w-4 h-4" /> Driving Instructor
                </button>
                <button
                  type="button"
                  onClick={() => handleCategorySwitch("COMPUTER")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    newInst.category === "COMPUTER"
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Monitor className="w-4 h-4" /> Computer Tutor
                </button>
                <button
                  type="button"
                  onClick={() => handleCategorySwitch("AI")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    newInst.category === "AI"
                      ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> AI Tutor
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateInstructor} className="mt-4 space-y-3.5 text-xs">
              {/* Basic Personal Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace"
                    value={newInst.firstName}
                    onChange={(e) => setNewInst({ ...newInst, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mwangi"
                    value={newInst.lastName}
                    onChange={(e) => setNewInst({ ...newInst, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="faculty@kenacollege.com"
                    value={newInst.email}
                    onChange={(e) => setNewInst({ ...newInst, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={newInst.phone}
                    onChange={(e) => setNewInst({ ...newInst, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* License / Staff ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {newInst.category === "DRIVING"
                      ? "NTSA Instructor License # *"
                      : "Tutor Staff ID / Accreditation # *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      newInst.category === "DRIVING"
                        ? "NTSA-INS-XXXXX"
                        : newInst.category === "COMPUTER"
                        ? "KENA-COMP-TTR-XX"
                        : "KENA-AI-TTR-XX"
                    }
                    value={newInst.licenseNumber}
                    onChange={(e) => setNewInst({ ...newInst, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Driving: Assigned Vehicle | Computer & AI: Lab Station */}
                {newInst.category === "DRIVING" ? (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Assigned Vehicle</label>
                    <select
                      value={newInst.assignedVehicleId}
                      onChange={(e) => setNewInst({ ...newInst, assignedVehicleId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">-- None / Pool Vehicle --</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.make} {v.model} ({v.registrationPlate})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {newInst.category === "COMPUTER" ? "Assigned Computer Lab & Station" : "Assigned AI Lab & Tech Suite"}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        newInst.category === "COMPUTER"
                          ? "e.g. Lab 1 - Station 04"
                          : "e.g. AI Innovation Suite - Station A"
                      }
                      value={newInst.labStation}
                      onChange={(e) => setNewInst({ ...newInst, labStation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* DEDICATED SECTION FOR COMPUTER TUTOR */}
              {newInst.category === "COMPUTER" && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-700" />
                      <span className="font-bold text-blue-900">Computer Course Modules Taught (10 Topics)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => selectAllModules("COMPUTER", false)}
                        className="px-2 py-0.5 rounded bg-blue-200/60 hover:bg-blue-200 text-blue-800 font-bold cursor-pointer"
                      >
                        Select All 10
                      </button>
                      <button
                        type="button"
                        onClick={() => clearAllModules(false)}
                        className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 font-medium cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {OFFICIAL_COMPUTER_TOPICS.map((topic) => {
                      const selected = newInst.modulesTaught.includes(topic.title);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleModuleSelection(topic.title, false)}
                          className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                            selected
                              ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {selected ? (
                            <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          )}
                          <span className="truncate text-[11px] font-semibold">{topic.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Technical Qualifications &amp; Certifications
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Diploma in Computer Science, ICDL, CompTIA A+, MOS"
                      value={newInst.certifications}
                      onChange={(e) => setNewInst({ ...newInst, certifications: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* DEDICATED SECTION FOR AI TUTOR */}
              {newInst.category === "AI" && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-200/60">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span className="font-bold text-purple-900">Modern AI Topics Taught (9 Topics)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => selectAllModules("AI", false)}
                        className="px-2 py-0.5 rounded bg-purple-200/60 hover:bg-purple-200 text-purple-800 font-bold cursor-pointer"
                      >
                        Select All 9
                      </button>
                      <button
                        type="button"
                        onClick={() => clearAllModules(false)}
                        className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 font-medium cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {OFFICIAL_AI_TOPICS.map((topic) => {
                      const selected = newInst.modulesTaught.includes(topic.title);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleModuleSelection(topic.title, false)}
                          className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                            selected
                              ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {selected ? (
                            <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          )}
                          <span className="truncate text-[11px] font-semibold">{topic.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      AI Certifications &amp; Tools Stack
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Certified Prompt Engineer, Google AI, Midjourney Specialist"
                      value={newInst.certifications}
                      onChange={(e) => setNewInst({ ...newInst, certifications: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Specializations & Teaching Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty Specializations &amp; Profile Summary
                </label>
                <input
                  type="text"
                  placeholder={
                    newInst.category === "DRIVING"
                      ? "e.g. Manual, Highway Roadcraft, Model Town Board"
                      : newInst.category === "COMPUTER"
                      ? "e.g. Advanced Excel, Database Design, System Repair"
                      : "e.g. Prompt Architecture, AI Marketing Agency, Video Gen"
                  }
                  value={newInst.specializations}
                  onChange={(e) => setNewInst({ ...newInst, specializations: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving Faculty..." : "Save Faculty Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Instructor / Tutor Modal */}
      {editingInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Edit Faculty: {editingInst.firstName} {editingInst.lastName}
                </h3>
                <p className="text-xs text-slate-500">
                  Update credentials, course modules taught, lab station, and active status.
                </p>
              </div>
              <button
                onClick={() => setEditingInst(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {editForm.category === "DRIVING"
                      ? "NTSA License # *"
                      : "Staff ID / Accreditation # *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.licenseNumber}
                    onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                {editForm.category === "DRIVING" ? (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Vehicle</label>
                    <select
                      value={editForm.assignedVehicleId}
                      onChange={(e) => setEditForm({ ...editForm, assignedVehicleId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">-- None --</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.make} {v.model} ({v.registrationPlate})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Lab &amp; Station</label>
                    <input
                      type="text"
                      value={editForm.labStation}
                      onChange={(e) => setEditForm({ ...editForm, labStation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Edit Modules Checklist */}
              {editForm.category === "COMPUTER" && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-blue-200/60">
                    <span className="font-bold text-blue-900">Computer Course Modules (10 Topics)</span>
                    <button
                      type="button"
                      onClick={() => selectAllModules("COMPUTER", true)}
                      className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-1">
                    {OFFICIAL_COMPUTER_TOPICS.map((topic) => {
                      const selected = editForm.modulesTaught.includes(topic.title);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleModuleSelection(topic.title, true)}
                          className={`p-1.5 rounded-lg text-left border flex items-center gap-1.5 cursor-pointer ${
                            selected
                              ? "bg-blue-600 text-white border-blue-700"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {selected ? <Check className="w-3 h-3" /> : <div className="w-3 h-3" />}
                          <span className="truncate text-[10px] font-medium">{topic.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {editForm.category === "AI" && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-purple-200/60">
                    <span className="font-bold text-purple-900">Modern AI Topics (9 Topics)</span>
                    <button
                      type="button"
                      onClick={() => selectAllModules("AI", true)}
                      className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-1">
                    {OFFICIAL_AI_TOPICS.map((topic) => {
                      const selected = editForm.modulesTaught.includes(topic.title);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleModuleSelection(topic.title, true)}
                          className={`p-1.5 rounded-lg text-left border flex items-center gap-1.5 cursor-pointer ${
                            selected
                              ? "bg-purple-600 text-white border-purple-700"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {selected ? <Check className="w-3 h-3" /> : <div className="w-3 h-3" />}
                          <span className="truncate text-[10px] font-medium">{topic.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specializations</label>
                  <input
                    type="text"
                    value={editForm.specializations}
                    onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teaching Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingInst(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Faculty Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstructorsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-xs text-slate-400">
          Loading faculty directory...
        </div>
      }
    >
      <InstructorsContent />
    </Suspense>
  );
}
