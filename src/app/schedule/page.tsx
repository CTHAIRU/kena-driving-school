"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Car,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  MapPin,
  X,
  Filter,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

function ScheduleContent() {
  const searchParams = useSearchParams();
  const initialStudentId = searchParams.get("studentId") || "";

  const [lessons, setLessons] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterInstructor, setFilterInstructor] = useState("ALL");
  const [filterVehicle, setFilterVehicle] = useState("ALL");

  // Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");
  const [booking, setBooking] = useState({
    studentId: initialStudentId,
    instructorId: "",
    vehicleId: "",
    lessonType: "PRACTICAL_DRIVING",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    durationHours: 1.5,
    pickupLocation: "Central Academy Campus",
    skillsCovered: "Clutch Control, Hill Starts, Parallel Parking",
  });

  // Completion Modal
  const [completeLessonId, setCompleteLessonId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [skillsTaught, setSkillsTaught] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append("date", selectedDate);
      if (filterInstructor !== "ALL") params.append("instructorId", filterInstructor);
      if (filterVehicle !== "ALL") params.append("vehicleId", filterVehicle);

      const res = await fetch(`/api/lessons?${params.toString()}`);
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [stRes, inRes, veRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/instructors"),
        fetch("/api/vehicles"),
      ]);
      const stData = await stRes.json();
      const inData = await inRes.json();
      const veData = await veRes.json();

      setStudents(Array.isArray(stData) ? stData : []);
      setInstructors(Array.isArray(inData) ? inData : []);
      setVehicles(Array.isArray(veData) ? veData : []);

      if (inData.length > 0) {
        setBooking((prev) => ({
          ...prev,
          instructorId: inData[0].id,
          vehicleId: inData[0].assignedVehicleId || veData[0]?.id || "",
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [selectedDate, filterInstructor, filterVehicle]);

  const handleBookLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBookError("");

    try {
      const startTime = new Date(`${booking.date}T${booking.time}:00`).toISOString();

      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: booking.studentId,
          instructorId: booking.instructorId,
          vehicleId: booking.vehicleId || null,
          lessonType: booking.lessonType,
          startTime,
          durationHours: booking.durationHours,
          pickupLocation: booking.pickupLocation,
          skillsCovered: booking.skillsCovered,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule lesson");
      }

      setIsBookModalOpen(false);
      fetchLessons();
    } catch (err: any) {
      setBookError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeLessonId) return;
    setIsCompleting(true);

    try {
      const res = await fetch("/api/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: completeLessonId,
          status: "COMPLETED",
          instructorFeedback: feedback,
          rating,
          skillsCovered: skillsTaught,
        }),
      });

      if (res.ok) {
        setCompleteLessonId(null);
        setFeedback("");
        setRating(5);
        setSkillsTaught("");
        fetchLessons();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lesson Scheduling & Calendar</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Real-time conflict prevention for dual-control cars and certified instructors.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Driving Session</span>
        </button>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            className="text-xs px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Instructor Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-400">Instructor:</span>
            <select
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Instructors</option>
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.firstName} {inst.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-400">Vehicle:</span>
            <select
              value={filterVehicle}
              onChange={(e) => setFilterVehicle(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Fleet</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationPlate} ({v.make})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Daily Timetable */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Sessions for {formatDate(selectedDate)}
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {lessons.length} scheduled
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading schedule...</div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No driving lessons scheduled on this date. Click &quot;Book Driving Session&quot; to reserve a slot.
            </div>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Time & student */}
                <div className="flex items-start gap-4">
                  <div className="w-20 shrink-0 text-center py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold text-slate-900">{formatTime(lesson.startTime)}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{lesson.durationHours} hrs</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        {lesson.student?.firstName} {lesson.student?.lastName}
                      </h4>
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {lesson.lessonType.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        {lesson.instructor?.firstName} {lesson.instructor?.lastName}
                      </span>
                      {lesson.vehicle && (
                        <span className="flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                          {lesson.vehicle.make} ({lesson.vehicle.registrationPlate} • {lesson.vehicle.transmission})
                        </span>
                      )}
                      {lesson.pickupLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {lesson.pickupLocation}
                        </span>
                      )}
                    </div>

                    {lesson.skillsCovered && (
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        🎯 Focus: {lesson.skillsCovered}
                      </p>
                    )}

                    {lesson.instructorFeedback && (
                      <p className="text-xs text-slate-700 mt-2 bg-white p-2 rounded-lg border border-slate-200 italic">
                        Feedback: &quot;{lesson.instructorFeedback}&quot; (⭐ {lesson.rating || 5}/5)
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      lesson.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : lesson.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {lesson.status}
                  </span>

                  {lesson.status === "SCHEDULED" && (
                    <button
                      onClick={() => {
                        setCompleteLessonId(lesson.id);
                        setSkillsTaught(lesson.skillsCovered || "");
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Book Lesson Modal with Conflict Prevention */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Schedule Driving Session</h3>
                <p className="text-xs text-slate-500">Automated double-booking prevention enabled.</p>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{bookError}</span>
              </div>
            )}

            <form onSubmit={handleBookLesson} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Student *</label>
                <select
                  required
                  value={booking.studentId}
                  onChange={(e) => setBooking({ ...booking, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.licenseCategory} • {s.transmission})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Instructor *</label>
                  <select
                    required
                    value={booking.instructorId}
                    onChange={(e) => setBooking({ ...booking, instructorId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {instructors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.firstName} {i.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fleet Vehicle</label>
                  <select
                    value={booking.vehicleId}
                    onChange={(e) => setBooking({ ...booking, vehicleId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- No vehicle (Theory/Office) --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.make} ({v.registrationPlate} • {v.transmission})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Duration</label>
                  <select
                    value={booking.durationHours}
                    onChange={(e) => setBooking({ ...booking, durationHours: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="1.0">1.0 Hour</option>
                    <option value="1.5">1.5 Hours</option>
                    <option value="2.0">2.0 Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Session Type</label>
                  <select
                    value={booking.lessonType}
                    onChange={(e) => setBooking({ ...booking, lessonType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PRACTICAL_DRIVING">Practical Road Driving</option>
                    <option value="THEORY_CLASS">Theory & Regulations</option>
                    <option value="MOCK_TEST">Mock Driving Exam</option>
                    <option value="SIMULATOR">Simulator Session</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Campus or Student Address"
                    value={booking.pickupLocation}
                    onChange={(e) => setBooking({ ...booking, pickupLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Lesson Goal / Planned Topics</label>
                <input
                  type="text"
                  placeholder="e.g. Parallel parking, 3-point turns, roundabouts"
                  value={booking.skillsCovered}
                  onChange={(e) => setBooking({ ...booking, skillsCovered: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Checking Schedule..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Lesson Sign-Off Modal */}
      {completeLessonId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Lesson Sign-Off & Feedback</h3>
            <p className="text-xs text-slate-500 mt-1">
              Marking this session completed will automatically log hours towards student course completion.
            </p>

            <form onSubmit={handleCompleteLesson} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Student Performance Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Competencies Covered</label>
                <input
                  type="text"
                  value={skillsTaught}
                  onChange={(e) => setSkillsTaught(e.target.value)}
                  placeholder="e.g. Hill start, reverse bay parking"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instructor Feedback & Notes</label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Note student progress, confidence, mirror checks, or areas for improvement next session."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCompleteLessonId(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompleting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {isCompleting ? "Saving..." : "Sign Off Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}

