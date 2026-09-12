import { useEffect, useState } from "react";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    experience: "",
    consultationFee: "",
    phone: "",
    description: "",
    image: "",
    active: true,
  });

  const token = localStorage.getItem("adminToken");

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "https://v2-aesthetic-clinic-backend-production.up.railway.app",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Unable to fetch doctors", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
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
      ? `https://v2-aesthetic-clinic-backend-production.up.railway.app/api/doctors/${editingId}`
      : "https://v2-aesthetic-clinic-backend-production.up.railway.app";

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          specialization: form.specialization,
          experience: Number(form.experience),
          consultationFee: Number(form.consultationFee),
          phone: form.phone,
          description: form.description,
          image: form.image,
          active: form.active,
        }),
      });

      if (response.ok) {
        await fetchDoctors();
        resetForm();
      } else {
        alert("Unable to save doctor");
      }
    } catch (error) {
      console.error("Save doctor error", error);
      alert("Unable to connect to server");
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);

    setForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      experience: doctor.experience ?? "",
      consultationFee: doctor.consultationFee ?? "",
      phone: doctor.phone || "",
      description: doctor.description || "",
      image: doctor.image || "",
      active: doctor.active ?? true,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://v2-aesthetic-clinic-backend-production.up.railway.app/api/doctors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchDoctors();
      } else {
        alert("Unable to delete doctor");
      }
    } catch (error) {
      console.error("Delete doctor error", error);
    }
  };

  const toggleStatus = async (doctor) => {
    try {
      const response = await fetch(
        `https://v2-aesthetic-clinic-backend-production.up.railway.app/api/doctors/${doctor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: doctor.name,
            specialization: doctor.specialization,
            experience: doctor.experience,
            consultationFee: doctor.consultationFee,
            phone: doctor.phone,
            description: doctor.description,
            image: doctor.image,
            active: !doctor.active,
          }),
        }
      );

      if (response.ok) {
        await fetchDoctors();
      }
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      specialization: "",
      experience: "",
      consultationFee: "",
      phone: "",
      description: "",
      image: "",
      active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const text =
      `${doctor.name || ""} ${doctor.specialization || ""}`.toLowerCase();

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
              Doctors Management
            </h1>

            <p>
              Manage your clinic doctors and consultation details.
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
            + Add Doctor
          </button>

        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="service-form-card">

            <div className="service-form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Doctor"
                    : "Add New Doctor"}
                </h2>

                <p>
                  {editingId
                    ? "Update doctor details"
                    : "Add a new clinic doctor"}
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

                {/* DOCTOR NAME */}
                <div className="service-form-group">
                  <label>
                    Doctor Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter doctor name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* SPECIALIZATION */}
                <div className="service-form-group">
                  <label>
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    placeholder="Example: Dermatologist"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EXPERIENCE */}
                <div className="service-form-group">
                  <label>
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    name="experience"
                    placeholder="Example: 8"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CONSULTATION FEE */}
                <div className="service-form-group">
                  <label>
                    Consultation Fee (₹)
                  </label>

                  <input
                    type="number"
                    name="consultationFee"
                    placeholder="Example: 799"
                    min="0"
                    value={form.consultationFee}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PHONE */}
                <div className="service-form-group">
                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
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
                    placeholder="/images/doctors/doctor.jpg"
                    value={form.image}
                    onChange={handleChange}
                  />

                  <small>
                    Example: /images/doctors/doctor.jpg
                  </small>
                </div>

                {/* DESCRIPTION */}
                <div className="service-form-group service-description-field">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter doctor description"
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
                  Doctor is active
                </span>

              </label>

              {/* ACTION BUTTONS */}
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
                    ? "Update Doctor"
                    : "Save Doctor"}
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
              placeholder="Search doctor or specialization..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="service-count">
            {filteredDoctors.length} Doctors
          </div>

        </div>

        {/* TABLE */}
        <div className="services-table-card">

          <div className="services-table">

            <div className="services-table-head">

              <span>Doctor</span>
              <span>Specialization</span>
              <span>Experience</span>
              <span>Fee</span>
              <span>Status</span>
              <span>Actions</span>

            </div>

            {filteredDoctors.length === 0 ? (

              <div className="services-empty">

                <div>♧</div>

                <h3>
                  No doctors found
                </h3>

                <p>
                  Add your first clinic doctor to get started.
                </p>

              </div>

            ) : (

              filteredDoctors.map((doctor) => (

                <div
                  className="services-table-row"
                  key={doctor.id}
                >

                  {/* DOCTOR */}
                  <div className="service-name-cell">

                    <div className="service-icon">
                      ♧
                    </div>

                    <div>
                      <strong>
                        {doctor.name}
                      </strong>

                      <small>
                        Doctor #{doctor.id}
                      </small>
                    </div>

                  </div>

                  {/* SPECIALIZATION */}
                  <div className="service-category">
                    {doctor.specialization || "-"}
                  </div>

                  {/* EXPERIENCE */}
                  <div className="service-duration">
                    {doctor.experience ?? 0} years
                  </div>

                  {/* FEE */}
                  <div className="service-price">
                    ₹
                    {Number(
                      doctor.consultationFee || 0
                    ).toLocaleString("en-IN")}
                  </div>

                  {/* STATUS */}
                  <div>

                    <button
                      type="button"
                      className={
                        doctor.active
                          ? "service-status active"
                          : "service-status inactive"
                      }
                      onClick={() =>
                        toggleStatus(doctor)
                      }
                    >
                      {doctor.active
                        ? "Active"
                        : "Inactive"}
                    </button>

                  </div>

                  {/* ACTIONS */}
                  <div className="service-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(doctor)
                      }
                      title="Edit"
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(doctor.id)
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

export default AdminDoctors;