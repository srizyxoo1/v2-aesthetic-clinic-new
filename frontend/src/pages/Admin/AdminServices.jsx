import { useEffect, useState } from "react";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    priceNote: "",
    duration: "",
    durationNote: "",
    image: "",
    active: true,
  });

  const token = localStorage.getItem("adminToken");

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Unable to fetch services", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:8081/api/services/${editingId}`
      : "http://localhost:8081/api/services";

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: form.category,
          name: form.name,
          description: form.description,

          price:
            form.price === ""
              ? null
              : Number(form.price),

          priceNote: form.priceNote,

          duration:
            form.duration === ""
              ? null
              : Number(form.duration),

          durationNote: form.durationNote,

          image: form.image,
          active: form.active,
        }),
      });

      if (response.ok) {
        await fetchServices();
        resetForm();
      } else {
        alert("Unable to save service");
      }
    } catch (error) {
      console.error("Save service error", error);
      alert("Unable to connect to server");
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      category: service.category || "",
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      priceNote: service.priceNote || "",
      duration: service.duration ?? "",
      durationNote: service.durationNote || "",
      image: service.image || "",
      active: service.active ?? true,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8081/api/services/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchServices();
      } else {
        alert("Unable to delete service");
      }
    } catch (error) {
      console.error("Delete service error", error);
    }
  };

  const toggleStatus = async (service) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/services/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: service.category,
            name: service.name,
            description: service.description,
            price: service.price,
            priceNote: service.priceNote,
            duration: service.duration,
            durationNote: service.durationNote,
            image: service.image,
            active: !service.active,
          }),
        }
      );

      if (response.ok) {
        await fetchServices();
      }
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const resetForm = () => {
    setForm({
      category: "",
      name: "",
      description: "",
      price: "",
      priceNote: "",
      duration: "",
      durationNote: "",
      image: "",
      active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const filteredServices = services.filter((service) => {
    const text =
      `${service.name || ""} ${service.category || ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

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

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <div className="services-management-header">

          <div>
            <span className="admin-tag">
              V2 AESTHETIC
            </span>

            <h1>
              Services Management
            </h1>

            <p>
              Manage your clinic services, pricing and availability.
            </p>
          </div>

          <button
            type="button"
            className="add-service-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Service
          </button>

        </div>

        {/* FORM */}
        {showForm && (
          <div className="service-form-card">

            <div className="service-form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Service"
                    : "Add New Service"}
                </h2>

                <p>
                  {editingId
                    ? "Update service details"
                    : "Add a new clinic service"}
                </p>
              </div>

              <button
                type="button"
                className="service-close-btn"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="service-form-grid">

                {/* CATEGORY */}
                <div className="service-form-group">
                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="Doctor Consultation">
                      Doctor Consultation
                    </option>

                    <option value="Spa & Wellness">
                      Spa & Wellness
                    </option>

                    <option value="Bridal Makeup">
                      Bridal Makeup
                    </option>

                    <option value="Hair Care">
                      Hair Care
                    </option>

                    <option value="Treatment">
                      Treatment
                    </option>
                  </select>
                </div>

                {/* SERVICE NAME */}
                <div className="service-form-group">
                  <label>
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter service name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PRICE */}
                <div className="service-form-group">
                  <label>
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price (optional)"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>

                {/* PRICE NOTE */}
                <div className="service-form-group">
                  <label>
                    Price Note
                  </label>

                  <input
                    type="text"
                    name="priceNote"
                    placeholder="e.g. Starting from"
                    value={form.priceNote}
                    onChange={handleChange}
                  />
                </div>

                {/* DURATION */}
                <div className="service-form-group">
                  <label>
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    name="duration"
                    placeholder="Enter duration (optional)"
                    value={form.duration}
                    onChange={handleChange}
                  />
                </div>

                {/* DURATION NOTE */}
                <div className="service-form-group">
                  <label>
                    Duration Note
                  </label>

                  <input
                    type="text"
                    name="durationNote"
                    placeholder="e.g. Approx."
                    value={form.durationNote}
                    onChange={handleChange}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="service-form-group service-description-field">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter a short description for this service"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                {/* IMAGE */}
                <div className="service-form-group">
                  <label>
                    Image Path
                  </label>

                  <input
                    type="text"
                    name="image"
                    placeholder="/images/services/blow-dry.jpg"
                    value={form.image}
                    onChange={handleChange}
                  />

                  <small>
                    Example: /images/services/blow-dry.jpg
                  </small>
                </div>

              </div>

              {/* ACTIVE */}
              <label className="service-active-option">

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />

                <span>
                  Service is active
                </span>

              </label>

              {/* ACTIONS */}
              <div className="service-form-actions">

                <button
                  type="button"
                  className="service-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="service-save-btn"
                >
                  {editingId
                    ? "Update Service"
                    : "Save Service"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SEARCH */}
        <div className="services-toolbar">

          <div className="service-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search service or category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="service-count">
            {filteredServices.length} Services
          </div>

        </div>

        {/* TABLE */}
        <div className="services-table-card">

          <div className="services-table">

            <div className="services-table-head">
              <span>Service</span>
              <span>Category</span>
              <span>Price</span>
              <span>Duration</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredServices.length === 0 ? (

              <div className="services-empty">

                <div>✦</div>

                <h3>
                  No services found
                </h3>

                <p>
                  Add your first clinic service to get started.
                </p>

              </div>

            ) : (

              filteredServices.map((service) => (

                <div
                  className="services-table-row"
                  key={service.id}
                >

                  {/* SERVICE */}
                  <div className="service-name-cell">

                    <div className="service-icon">
                      ✦
                    </div>

                    <div>

                      <strong>
                        {service.name}
                      </strong>

                      <small>
                        Service #{service.id}
                      </small>

                    </div>

                  </div>

                  {/* CATEGORY */}
                  <div className="service-category">
                    {service.category}
                  </div>

                 {/* PRICE */}
<div className="service-form-group">
  <label>Price (₹)</label>

  <input
    type="number"
    name="price"
    placeholder="Enter price"
    value={form.price}
    onChange={handleChange}
  />
</div>

{/* PRICE NOTE */}
<div className="service-form-group">
  <label>Price Note</label>

  <input
    type="text"
    name="priceNote"
    placeholder="e.g. Starting from"
    value={form.priceNote}
    onChange={handleChange}
  />
</div>

{/* DURATION */}
<div className="service-form-group">
  <label>Duration (minutes)</label>

  <input
    type="number"
    name="duration"
    placeholder="Example: 60"
    value={form.duration}
    onChange={handleChange}
  />
</div>

{/* DURATION NOTE */}
<div className="service-form-group">
  <label>Duration Note</label>

  <input
    type="text"
    name="durationNote"
    placeholder="e.g. Approx."
    value={form.durationNote}
    onChange={handleChange}
  />
</div>

                  {/* STATUS */}
                  <div>

                    <button
                      type="button"
                      className={
                        service.active
                          ? "service-status active"
                          : "service-status inactive"
                      }
                      onClick={() =>
                        toggleStatus(service)
                      }
                    >
                      {service.active
                        ? "Active"
                        : "Inactive"}
                    </button>

                  </div>

                  {/* ACTIONS */}
                  <div className="service-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(service)
                      }
                      title="Edit"
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(service.id)
                      }
                      title="Delete"
                    >
                      🗑
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminServices;