import { useEffect, useState } from "react";

function AdminTreatments() {
  const [treatments, setTreatments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    active: true,
  });

  const token = localStorage.getItem("adminToken");

  const fetchTreatments = async () => {
    try {
      const response = await fetch(
        "https://v2-aesthetic-clinic-backend-production.up.railway.app/api/treatments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTreatments(data);
      } else if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Unable to fetch treatments:", error);
    }
  };

  useEffect(() => {
    fetchTreatments();
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
      ? `https://v2-aesthetic-clinic-backend-production.up.railway.app/api/treatments/${editingId}`
      : "https://v2-aesthetic-clinic-backend-production.up.railway.app/api/treatments";

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          duration: Number(form.duration),
          image: form.image,
          active: form.active,
        }),
      });

      if (response.ok) {
        await fetchTreatments();
        resetForm();
      } else {
        alert("Unable to save treatment");
      }
    } catch (error) {
      console.error("Save treatment error:", error);
      alert("Unable to connect to server");
    }
  };

  const handleEdit = (treatment) => {
    setEditingId(treatment.id);

    setForm({
      name: treatment.name || "",
      category: treatment.category || "",
      description: treatment.description || "",
      price: treatment.price ?? "",
      duration: treatment.duration ?? "",
      image: treatment.image || "",
      active: treatment.active ?? true,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this treatment?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://v2-aesthetic-clinic-backend-production.up.railway.app/api/treatments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchTreatments();
      } else {
        alert("Unable to delete treatment");
      }
    } catch (error) {
      console.error("Delete treatment error:", error);
    }
  };

  const toggleStatus = async (treatment) => {
    try {
      const response = await fetch(
        `https://v2-aesthetic-clinic-backend-production.up.railway.app/api/treatments/${treatment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: treatment.name,
            category: treatment.category,
            description: treatment.description,
            price: treatment.price,
            duration: treatment.duration,
            image: treatment.image,
            active: !treatment.active,
          }),
        }
      );

      if (response.ok) {
        await fetchTreatments();
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      description: "",
      price: "",
      duration: "",
      image: "",
      active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const filteredTreatments = treatments.filter((treatment) => {
    const text = `${treatment.name || ""} ${
      treatment.category || ""
    }`.toLowerCase();

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
              Treatments Management
            </h1>

            <p>
              Manage your clinic treatments and treatment details.
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
            + Add Treatment
          </button>

        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="service-form-card">

            <div className="service-form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Treatment"
                    : "Add New Treatment"}
                </h2>

                <p>
                  {editingId
                    ? "Update treatment details"
                    : "Add a new clinic treatment"}
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

                {/* NAME */}
                <div className="service-form-group">
                  <label>Treatment Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Example: Laser Treatment"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CATEGORY */}
                <div className="service-form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    name="category"
                    placeholder="Example: Skin Treatment"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>

                {/* PRICE */}
                <div className="service-form-group">
                  <label>Price (₹)</label>

                  <input
                    type="number"
                    name="price"
                    placeholder="Example: 2500"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DURATION */}
                <div className="service-form-group">
                  <label>Duration (Minutes)</label>

                  <input
                    type="number"
                    name="duration"
                    placeholder="Example: 60"
                    min="0"
                    value={form.duration}
                    onChange={handleChange}
                  />
                </div>

                {/* IMAGE */}
                <div className="service-form-group">
                  <label>Image Path</label>

                  <input
                    type="text"
                    name="image"
                    placeholder="/images/treatments/laser.jpg"
                    value={form.image}
                    onChange={handleChange}
                  />

                  <small>
                    Example: /images/treatments/laser.jpg
                  </small>
                </div>

                {/* DESCRIPTION */}
                <div className="service-form-group service-description-field">
                  <label>Description</label>

                  <textarea
                    name="description"
                    placeholder="Enter treatment description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
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
                  Treatment is active
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
                    ? "Update Treatment"
                    : "Save Treatment"}
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
              placeholder="Search treatment..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="service-count">
            {filteredTreatments.length} Treatments
          </div>

        </div>

        {/* TABLE */}
        <div className="services-table-card">

          <div className="services-table">

            <div className="services-table-head">
              <span>Treatment</span>
              <span>Category</span>
              <span>Duration</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredTreatments.length === 0 ? (

              <div className="services-empty">

                <div>✧</div>

                <h3>
                  No treatments found
                </h3>

                <p>
                  Add your first clinic treatment to get started.
                </p>

              </div>

            ) : (

              filteredTreatments.map((treatment) => (

                <div
                  className="services-table-row"
                  key={treatment.id}
                >

                  {/* TREATMENT */}
                  <div className="service-name-cell">

                    <div className="service-icon">
                      ✧
                    </div>

                    <div>
                      <strong>
                        {treatment.name}
                      </strong>

                      <small>
                        Treatment #{treatment.id}
                      </small>
                    </div>

                  </div>

                  {/* CATEGORY */}
                  <div className="service-category">
                    {treatment.category || "-"}
                  </div>

                  {/* DURATION */}
                  <div className="service-duration">
                    {treatment.duration
                      ? `${treatment.duration} mins`
                      : "-"}
                  </div>

                  {/* PRICE */}
                  <div className="service-price">
                    ₹
                    {Number(
                      treatment.price || 0
                    ).toLocaleString("en-IN")}
                  </div>

                  {/* STATUS */}
                  <div>
                    <button
                      type="button"
                      className={
                        treatment.active
                          ? "service-status active"
                          : "service-status inactive"
                      }
                      onClick={() =>
                        toggleStatus(treatment)
                      }
                    >
                      {treatment.active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="service-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(treatment)
                      }
                      title="Edit"
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(treatment.id)
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

export default AdminTreatments;