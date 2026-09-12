import { useEffect, useState } from "react";

const API_URL = "http://v2-aesthetic-clinic-backend-production.up.railway.app/api/testimonials";

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    service: "",
    review: "",
    rating: 5,
    googleReviewLink: "",
    active: true,
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.status === 401 || response.status === 403) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      service: "",
      review: "",
      rating: 5,
      googleReviewLink: "",
      active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `${API_URL}/${editingId}`
      : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });

      if (response.status === 401 || response.status === 403) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save testimonial");
      }

      await fetchTestimonials();
      resetForm();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Unable to save testimonial.");
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      customerName: testimonial.customerName || "",
      service: testimonial.service || "",
      review: testimonial.review || "",
      rating: testimonial.rating || 5,
      googleReviewLink: testimonial.googleReviewLink || "",
      active: testimonial.active,
    });

    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.status === 401 || response.status === 403) {
        window.location.href = "/admin/testimonials";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Unable to delete testimonial.");
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) =>
    (testimonial.customerName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

        <a href="/" className="admin-back-home">
          ← Back to Website
        </a>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        <div className="admin-page-header">

          <div>
            <h1>Testimonials</h1>

            <p>
              Manage customer reviews and Google review links.
            </p>
          </div>

          <button
            className="admin-primary-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Testimonial
          </button>

        </div>

        {/* SEARCH */}
        <div className="admin-toolbar">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* FORM */}
        {showForm && (
          <div className="admin-form-card">

            <div className="admin-form-header">

              <h2>
                {editingId
                  ? "Edit Testimonial"
                  : "Add Testimonial"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="admin-close-btn"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="admin-form-grid">

                {/* CUSTOMER NAME */}
                <div className="admin-form-group">

                  <label>Customer Name</label>

                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Customer name"
                    required
                  />

                </div>

                {/* SERVICE */}
                <div className="admin-form-group">

                  <label>Service</label>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Service
                    </option>

                    <option value="Skin Care">
                      Skin Care
                    </option>

                    <option value="Hair Care">
                      Hair Care
                    </option>

                    <option value="Bridal Makeup">
                      Bridal Makeup
                    </option>

                    <option value="Spa & Wellness">
                      Spa & Wellness
                    </option>

                    <option value="Doctor Consultation">
                      Doctor Consultation
                    </option>
                  </select>

                </div>

                {/* RATING */}
                <div className="admin-form-group">

                  <label>Rating</label>

                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                  >
                    <option value="5">
                      ★★★★★ 5
                    </option>

                    <option value="4">
                      ★★★★☆ 4
                    </option>

                    <option value="3">
                      ★★★☆☆ 3
                    </option>

                    <option value="2">
                      ★★☆☆☆ 2
                    </option>

                    <option value="1">
                      ★☆☆☆☆ 1
                    </option>
                  </select>

                </div>

                {/* GOOGLE REVIEW LINK */}
                <div className="admin-form-group">

                  <label>Google Review Link</label>

                  <input
                    type="url"
                    name="googleReviewLink"
                    value={formData.googleReviewLink}
                    onChange={handleChange}
                    placeholder="Paste Google Review link"
                  />

                </div>

                {/* REVIEW */}
                <div className="admin-form-group admin-full-width">

                  <label>Customer Review</label>

                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    placeholder="Copy and paste the customer's Google review here"
                    rows="5"
                    required
                  />

                </div>

                {/* ACTIVE */}
                <div className="admin-form-checkbox">

                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    id="testimonial-active"
                  />

                  <label htmlFor="testimonial-active">
                    Active
                  </label>

                </div>

              </div>

              <div className="admin-form-actions">

                <button
                  type="button"
                  onClick={resetForm}
                  className="admin-secondary-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-btn"
                >
                  {editingId
                    ? "Update"
                    : "Save Testimonial"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* REVIEWS */}
        <div className="admin-table-card">

          <div className="admin-table-header">

            <h2>Customer Reviews</h2>

            <span>
              {filteredTestimonials.length} Reviews
            </span>

          </div>

          {filteredTestimonials.length === 0 ? (

            <div className="admin-empty-state">

              <div>♡</div>

              <h3>
                No testimonials yet
              </h3>

              <p>
                Add your first customer review.
              </p>

            </div>

          ) : (

            <div className="testimonial-admin-grid">

              {filteredTestimonials.map((testimonial) => (

                <div
                  className="testimonial-admin-card"
                  key={testimonial.id}
                >

                  <div className="testimonial-admin-content">

                    <h3>
                      {testimonial.customerName}
                    </h3>

                    <span>
                      {testimonial.service}
                    </span>

                    <div className="testimonial-rating">
                      {"★".repeat(testimonial.rating || 0)}
                    </div>

                    <p>
                      {testimonial.review}
                    </p>

                    {testimonial.googleReviewLink && (
                      <a
                        href={testimonial.googleReviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-review-link"
                      >
                        View on Google →
                      </a>
                    )}

                    <div className="testimonial-admin-bottom">

                      <span
                        className={
                          testimonial.active
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {testimonial.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                      <div className="testimonial-actions">

                        <button
                          onClick={() =>
                            handleEdit(testimonial)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(testimonial.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminTestimonials;