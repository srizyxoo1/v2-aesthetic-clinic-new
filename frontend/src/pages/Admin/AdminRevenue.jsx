import { useEffect, useMemo, useState } from "react";

const APPOINTMENTS_API =
  "http://v2-aesthetic-clinic-backend-production.up.railway.app/api/appointments";

const SERVICES_API =
  "http://v2-aesthetic-clinic-backend-production.up.railway.app/api/services";

function AdminRevenue() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const [appointmentsResponse, servicesResponse] =
          await Promise.all([
            fetch(APPOINTMENTS_API, {
              headers,
            }),
            fetch(SERVICES_API, {
              headers,
            }),
          ]);

        if (
          appointmentsResponse.status === 401 ||
          appointmentsResponse.status === 403 ||
          servicesResponse.status === 401 ||
          servicesResponse.status === 403
        ) {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
          return;
        }

        if (!appointmentsResponse.ok) {
          throw new Error("Unable to load appointments");
        }

        if (!servicesResponse.ok) {
          throw new Error("Unable to load services");
        }

        const appointmentsData =
          await appointmentsResponse.json();

        const servicesData =
          await servicesResponse.json();

        setAppointments(appointmentsData);
        setServices(servicesData);
      } catch (err) {
        console.error(err);
        setError("Unable to load revenue data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  /*
   * Match appointment service with service price
   */
  const getServicePrice = (appointment) => {
    const matchedService = services.find(
      (service) =>
        service.name?.toLowerCase().trim() ===
        appointment.service?.toLowerCase().trim()
    );

    return matchedService?.price || 0;
  };

  /*
   * Only COMPLETED appointments count as revenue
   */
  const completedAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "COMPLETED"
    );
  }, [appointments]);

  /*
   * Date + search filtering
   */
  const filteredRevenue = useMemo(() => {
    return completedAppointments
      .filter((appointment) => {
        const searchValue = search
          .toLowerCase()
          .trim();

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
            .includes(searchValue)
        );
      })
      .filter((appointment) => {
        if (!fromDate) {
          return true;
        }

        return (
          appointment.appointmentDate >= fromDate
        );
      })
      .filter((appointment) => {
        if (!toDate) {
          return true;
        }

        return (
          appointment.appointmentDate <= toDate
        );
      })
      .slice()
      .reverse();
  }, [
    completedAppointments,
    search,
    fromDate,
    toDate,
  ]);

  /*
   * Total revenue
   */
  const totalRevenue = useMemo(() => {
    return completedAppointments.reduce(
      (total, appointment) =>
        total + getServicePrice(appointment),
      0
    );
  }, [completedAppointments, services]);

  /*
   * Today's revenue
   */
  const todayRevenue = useMemo(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    return completedAppointments.reduce(
      (total, appointment) => {
        if (
          appointment.appointmentDate === today
        ) {
          return (
            total + getServicePrice(appointment)
          );
        }

        return total;
      },
      0
    );
  }, [completedAppointments, services]);

  /*
   * This month's revenue
   */
  const monthRevenue = useMemo(() => {
    const now = new Date();

    const currentYear =
      now.getFullYear();

    const currentMonth =
      now.getMonth();

    return completedAppointments.reduce(
      (total, appointment) => {
        if (!appointment.appointmentDate) {
          return total;
        }

        const date = new Date(
          `${appointment.appointmentDate}T00:00:00`
        );

        if (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth
        ) {
          return (
            total + getServicePrice(appointment)
          );
        }

        return total;
      },
      0
    );
  }, [completedAppointments, services]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
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

          <a href="/admin/appointments">
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

          <a
            href="/admin/testimonials"
            
          >
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

            <h1>Revenue</h1>

            <p>
              Track revenue from completed
              clinic appointments.
            </p>

          </div>

        </header>

        {/* STATS */}
        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>

              <span>Total Revenue</span>

              <strong>
                {formatCurrency(totalRevenue)}
              </strong>

              <small>
                From completed appointments
              </small>

            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon">
              ◷
            </div>

            <div>

              <span>Today Revenue</span>

              <strong>
                {formatCurrency(todayRevenue)}
              </strong>

              <small>
                Completed today
              </small>

            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>

              <span>This Month</span>

              <strong>
                {formatCurrency(monthRevenue)}
              </strong>

              <small>
                Current month revenue
              </small>

            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>

              <span>Completed Visits</span>

              <strong>
                {completedAppointments.length}
              </strong>

              <small>
                Revenue-generating visits
              </small>

            </div>

          </div>

        </section>

        {/* REVENUE PANEL */}
        <section className="admin-panel">

          <div className="appointments-management-header">

            <div>

              <span>
                REVENUE MANAGEMENT
              </span>

              <h2>
                Completed Appointments
              </h2>

            </div>

            <div className="appointments-count">
              {filteredRevenue.length} records
            </div>

          </div>

          {/* FILTERS */}
          <div className="appointment-filters">

            <div className="appointment-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search customer or service..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="appointment-date-filter">

              <label>
                From
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
              />

            </div>

            <div className="appointment-date-filter">

              <label>
                To
              </label>

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
              />

            </div>

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

              <span>
                Customer
              </span>

              <span>
                Service
              </span>

              <span>
                Date
              </span>

              <span>
                Status
              </span>

              <span>
                Amount
              </span>

            </div>

            {loading && (
              <div className="full-table-empty">
                Loading revenue...
              </div>
            )}

            {!loading && error && (
              <div className="full-table-empty">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              filteredRevenue.length === 0 && (
                <div className="full-table-empty">
                  No completed appointments found.
                </div>
              )}

            {!loading &&
              !error &&
              filteredRevenue.map(
                (appointment) => {

                  const price =
                    getServicePrice(
                      appointment
                    );

                  return (
                    <div
                      className="full-appointment-row"
                      key={appointment.id}
                    >

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

                      <div className="appointment-service">

                        <strong>
                          {appointment.service}
                        </strong>

                        <small>
                          {appointment.category}
                        </small>

                      </div>

                      <div className="appointment-datetime">

                        <strong>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>

                        <small>
                          Completed
                        </small>

                      </div>

                      <div className="full-status-control">

                        <b className="status completed">
                          COMPLETED
                        </b>

                      </div>

                      <div className="appointment-revenue-amount">

                        <strong>
                          {formatCurrency(price)}
                        </strong>

                      </div>

                    </div>
                  );
                }
              )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminRevenue;