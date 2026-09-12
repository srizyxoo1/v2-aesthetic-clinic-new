import { useEffect, useMemo, useState } from "react";

function AdminCustomers() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("adminToken");

      try {
        const response = await fetch(
          "http://localhost:8081/api/appointments",
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
          setError("Unable to load customers.");
        }
      } catch (err) {
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

  /* Create unique customers from appointments */
  const customers = useMemo(() => {
    const customerMap = new Map();

    appointments.forEach((appointment) => {
      const phone = appointment.phone;

      if (!phone) return;

      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          phone,
          title: appointment.title || "",
          name: appointment.name || "",
          appointments: [],
        });
      }

      customerMap
        .get(phone)
        .appointments.push(appointment);
    });

    return Array.from(customerMap.values()).map(
      (customer) => {
        const customerAppointments =
          customer.appointments;

        const sortedAppointments =
          customerAppointments
            .slice()
            .sort(
              (a, b) =>
                new Date(b.appointmentDate) -
                new Date(a.appointmentDate)
            );

        const services = [
          ...new Set(
            customerAppointments
              .map((item) => item.service)
              .filter(Boolean)
          ),
        ];

        return {
          ...customer,
          totalAppointments:
            customerAppointments.length,
          lastAppointment:
            sortedAppointments[0]?.appointmentDate || "",
          services,
        };
      }
    );
  }, [appointments]);

  /* Search customers */
  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          ?.toLowerCase()
          .includes(value) ||
        customer.phone
          ?.toLowerCase()
          .includes(value) ||
        customer.services.some((service) =>
          service.toLowerCase().includes(value)
        )
      );
    });
  }, [customers, search]);

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

            <h1>Customers</h1>

            <p>
              View and manage your clinic customers.
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
            <div className="stat-icon">♙</div>

            <div>
              <span>Total Customers</span>

              <strong>
                {customers.length}
              </strong>

              <small>
                Unique customers
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">◷</div>

            <div>
              <span>Total Bookings</span>

              <strong>
                {appointments.length}
              </strong>

              <small>
                All appointments
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">✦</div>

            <div>
              <span>Returning Customers</span>

              <strong>
                {
                  customers.filter(
                    (customer) =>
                      customer.totalAppointments > 1
                  ).length
                }
              </strong>

              <small>
                More than one booking
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Active Customers</span>

              <strong>
                {customers.length}
              </strong>

              <small>
                From clinic bookings
              </small>
            </div>
          </div>

        </section>

        {/* CUSTOMER PANEL */}
        <section className="admin-panel customers-management">

          <div className="customers-management-header">

            <div>
              <span>CUSTOMER MANAGEMENT</span>

              <h2>
                All Customers
              </h2>
            </div>

            <div className="customers-count">
              {filteredCustomers.length} customers
            </div>

          </div>

          {/* SEARCH */}
          <div className="customer-search-bar">

            <div className="customer-search">
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

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}

          </div>

          {/* TABLE */}
          <div className="customers-table">

            <div className="customers-table-head">

              <span>Customer</span>
              <span>Contact</span>
              <span>Services</span>
              <span>Appointments</span>
              <span>Last Visit</span>

            </div>

            {loading && (
              <div className="customer-empty">
                Loading customers...
              </div>
            )}

            {!loading && error && (
              <div className="customer-empty">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              filteredCustomers.length === 0 && (
                <div className="customer-empty">
                  No customers found.
                </div>
              )}

            {!loading &&
              !error &&
              filteredCustomers.map(
                (customer) => (

                  <div
                    className="customer-row"
                    key={customer.phone}
                  >

                    {/* CUSTOMER */}
                    <div className="customer-info">

                      <div className="customer-avatar">
                        {customer.name
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>

                      <div>
                        <strong>
                          {customer.title}{" "}
                          {customer.name}
                        </strong>

                        <small>
                          Customer
                        </small>
                      </div>

                    </div>

                    {/* PHONE */}
                    <div className="customer-phone">
                      <strong>
                        +91 {customer.phone}
                      </strong>
                    </div>

                    {/* SERVICES */}
                    <div className="customer-services">

                      {customer.services
                        .slice(0, 2)
                        .map((service) => (
                          <span key={service}>
                            {service}
                          </span>
                        ))}

                      {customer.services.length > 2 && (
                        <small>
                          +{customer.services.length - 2} more
                        </small>
                      )}

                    </div>

                    {/* APPOINTMENTS */}
                    <div className="customer-bookings">

                      <strong>
                        {customer.totalAppointments}
                      </strong>

                      <small>
                        booking
                        {customer.totalAppointments !== 1
                          ? "s"
                          : ""}
                      </small>

                    </div>

                    {/* LAST VISIT */}
                    <div className="customer-last-visit">

                      <strong>
                        {formatDate(
                          customer.lastAppointment
                        )}
                      </strong>

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

export default AdminCustomers;