import { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://v2-aesthetic-clinic-backend-production.up.railway.app";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [exactDate, setExactDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/appointments`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        } else {
          setError("Unable to load appointments.");
        }
      } catch (err) {
        console.error("Unable to fetch appointments", err);
        setError("Unable to connect to clinic server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() || "pending";
  };

  const updateAppointmentStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    setUpdatingId(id);

    try {
      const response = await fetch(
        `${API_URL}/api/appointments/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedAppointment = await response.json();

        setAppointments((currentAppointments) =>
          currentAppointments.map((appointment) =>
            appointment.id === updatedAppointment.id
              ? updatedAppointment
              : appointment
          )
        );
      } else if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        alert("Unable to update appointment status.");
      }
    } catch (err) {
      console.error("Update appointment error", err);
      alert("Unable to connect to clinic server.");
    } finally {
      setUpdatingId(null);
    }
  };

  /* FILTER APPOINTMENTS */
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const searchValue = search.toLowerCase().trim();

        if (!searchValue) {
          return true;
        }

        return (
          appointment.name
            ?.toLowerCase()
            .includes(searchValue) ||
          appointment.phone
            ?.toLowerCase()
            .includes(searchValue) ||
          appointment.service
            ?.toLowerCase()
            .includes(searchValue) ||
          appointment.category
            ?.toLowerCase()
            .includes(searchValue)
        );
      })
      .filter((appointment) => {
        if (statusFilter === "ALL") {
          return true;
        }

        return appointment.status === statusFilter;
      })
      .filter((appointment) => {
        if (!exactDate) {
          return true;
        }

        return appointment.appointmentDate === exactDate;
      })
      .filter((appointment) => {
        if (!fromDate) {
          return true;
        }

        return appointment.appointmentDate >= fromDate;
      })
      .filter((appointment) => {
        if (!toDate) {
          return true;
        }

        return appointment.appointmentDate <= toDate;
      })
      .slice()
      .reverse();
  }, [
    appointments,
    search,
    statusFilter,
    exactDate,
    fromDate,
    toDate,
  ]);

  const pendingCount = appointments.filter(
    (item) => item.status === "PENDING"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.status === "CONFIRMED"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setExactDate("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <img
            src="/images/icon.jpeg"
            alt="V2 Aesthetic Logo"
          />

          <div>
            <h2>V2 Aesthetic</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-menu">

          <a href="/admin/dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a
            href="/admin/appointments"
            className="active"
          >
            <span>◷</span>
            Appointments
          </a>

          <a href="/admin/customers">
            <span>♙</span>
            Customers
          </a>

          <a href="/admin/services">
            <span>✦</span>
            Services
          </a>

          <a href="/admin/doctors">
            <span>♧</span>
            Doctors
          </a>

          <a href="/admin/testimonials">
            <span>♡</span>
            Testimonials
          </a>

          <a href="/admin/revenue">
            <span>₹</span>
            Revenue
          </a>

        </nav>

        <a
          href="/"
          className="admin-back-home"
        >
          ← Back to Website
        </a>

      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <span className="admin-header-label">
              V2 AESTHETIC ADMIN
            </span>

            <h1>Appointments</h1>

            <p>
              Manage and track all clinic appointments.
            </p>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        {/* STATS */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="stat-icon">◷</div>

            <div>
              <span>Total Appointments</span>

              <strong>
                {appointments.length}
              </strong>

              <small>
                All clinic bookings
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">◌</div>

            <div>
              <span>Pending</span>

              <strong>
                {pendingCount}
              </strong>

              <small>
                Waiting for confirmation
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Confirmed</span>

              <strong>
                {confirmedCount}
              </strong>

              <small>
                Confirmed bookings
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">★</div>

            <div>
              <span>Completed</span>

              <strong>
                {completedCount}
              </strong>

              <small>
                Completed appointments
              </small>
            </div>
          </div>

        </section>

        {/* APPOINTMENTS */}
        <section className="admin-panel appointments-management">

          {/* HEADER */}
          <div className="appointments-management-header">

            <div>
              <span>
                BOOKINGS MANAGEMENT
              </span>

              <h2>
                All Appointments
              </h2>
            </div>

            <div className="appointments-count">
              {filteredAppointments.length} bookings
            </div>

          </div>

          {/* FILTERS */}
          <div className="appointment-filters">

            {/* SEARCH */}
            <div className="appointment-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search customer, phone or service..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* EXACT DATE */}
            <div className="appointment-date-filter">

              <label>Date</label>

              <input
                type="date"
                value={exactDate}
                onChange={(e) => {
                  setExactDate(e.target.value);

                  if (e.target.value) {
                    setFromDate("");
                    setToDate("");
                  }
                }}
              />

            </div>

            {/* FROM DATE */}
            <div className="appointment-date-filter">

              <label>From</label>

              <input
                type="date"
                value={fromDate}
                disabled={Boolean(exactDate)}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
              />

            </div>

            {/* TO DATE */}
            <div className="appointment-date-filter">

              <label>To</label>

              <input
                type="date"
                value={toDate}
                disabled={Boolean(exactDate)}
                min={fromDate || undefined}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
              />

            </div>

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="ALL">
                All Status
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

            {/* CLEAR */}
            <button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear
            </button>

          </div>

          {/* TABLE */}
          <div className="full-appointments-table">

            <div className="full-table-head">
              <span>Customer</span>
              <span>Contact</span>
              <span>Service</span>
              <span>Date & Time</span>
              <span>Status</span>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="full-table-empty">
                Loading appointments...
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="full-table-empty">
                {error}
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              filteredAppointments.length === 0 && (
                <div className="full-table-empty">
                  No appointments found.
                </div>
              )}

            {/* DATA */}
            {!loading &&
              !error &&
              filteredAppointments.map(
                (appointment) => (
                  <div
                    className="full-appointment-row"
                    key={appointment.id}
                  >

                    {/* CUSTOMER */}
                    <div className="full-customer">

                      <div className="customer-avatar">
                        {appointment.name
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>

                      <div>
                        <strong>
                          {appointment.title}{" "}
                          {appointment.name}
                        </strong>

                        <small>
                          #{appointment.id}
                        </small>
                      </div>

                    </div>

                    {/* CONTACT */}
                    <div className="appointment-contact">
                      <strong>
                        +91 {appointment.phone}
                      </strong>
                    </div>

                    {/* SERVICE */}
                    <div className="appointment-service">

                      <strong>
                        {appointment.service}
                      </strong>

                      <small>
                        {appointment.category}
                      </small>

                    </div>

                    {/* DATE + TIME */}
                    <div className="appointment-datetime">

                      <strong>
                        {formatDate(
                          appointment.appointmentDate
                        )}
                      </strong>

                      <small>
                        {formatTime(
                          appointment.appointmentTime
                        )}
                      </small>

                    </div>

                    {/* STATUS */}
                    <div className="full-status-control">

                      <b
                        className={`status ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </b>

                      <select
                        value={appointment.status}
                        disabled={
                          updatingId === appointment.id
                        }
                        onChange={(e) =>
                          updateAppointmentStatus(
                            appointment.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="CONFIRMED">
                          Confirmed
                        </option>

                        <option value="COMPLETED">
                          Completed
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>
                )
              )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminAppointments;