import { useEffect, useState } from "react";

function Appointment() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // ---------------------------------------------------------
  // FETCH ACTIVE SERVICES FROM BACKEND
  // ---------------------------------------------------------

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/services"
        );

        if (response.ok) {
          const data = await response.json();

          // Only active services should appear for customers
          const activeServices = data.filter(
            (item) => item.active === true
          );

          setServices(activeServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Unable to fetch services", err);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ---------------------------------------------------------
  // UNIQUE CATEGORIES
  // ---------------------------------------------------------

  const categories = [
    ...new Set(services.map((item) => item.category)),
  ];

  // ---------------------------------------------------------
  // SERVICES FOR SELECTED CATEGORY
  // ---------------------------------------------------------

  const categoryServices = services.filter(
    (item) => item.category === category
  );

  // ---------------------------------------------------------
  // CATEGORY CHANGE
  // ---------------------------------------------------------

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setService("");
  };

  // ---------------------------------------------------------
  // PHONE VALIDATION
  // ---------------------------------------------------------

  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setPhone(value);
  };

  // ---------------------------------------------------------
  // FORM SUBMIT
  // ---------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    // Mobile number validation
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setError(
        "Invalid mobile number. Please enter a valid 10-digit mobile number."
      );

      setLoading(false);
      return;
    }

    // Date validation
    if (appointmentDate < today) {
      setError(
        "Invalid appointment date. Please select today or a future date."
      );

      setLoading(false);
      return;
    }

    // Make sure category and service are selected
    if (!category || !service) {
      setError(
        "Please select a category and service."
      );

      setLoading(false);
      return;
    }

    const appointmentData = {
      title: title,
      name: name,
      phone: phone,
      category: category,
      service: service,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
       message: message,
    };

    try {
      const response = await fetch(
        "http://localhost:8081/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (response.ok) {
        setSuccess(
          "Your appointment request has been submitted successfully!"
        );

        setTitle("");
        setName("");
        setPhone("");
        setCategory("");
        setService("");
        setAppointmentDate("");
        setAppointmentTime("");
        setMessage("");
      } else {
        setError(
          "Unable to submit your appointment. Please try again."
        );
      }
    } catch (err) {
      console.error("Appointment error:", err);

      setError(
        "Unable to connect to the clinic server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="appointment-section"
      id="booking"
    >
      <div className="appointment-container">

        {/* LEFT CONTENT */}

        <div className="appointment-info">

          <span className="appointment-tag">
            ✦ RESERVE YOUR APPOINTMENT
          </span>

          <h2>
            Your Journey to
            <br />
            <span>Better Beauty Starts Here.</span>
          </h2>

          <p>
            Book your appointment with V2 Aesthetic Skin and
            Hair Care Clinic. Choose your preferred category,
            service, date and time.
          </p>

          <div className="appointment-highlights">

            <div>
              <span>✦</span>

              <div>
                <strong>Personalized Care</strong>

                <p>
                  Treatments selected according to your needs.
                </p>
              </div>
            </div>

            <div>
              <span>✦</span>

              <div>
                <strong>Expert Guidance</strong>

                <p>
                  Professional consultation and care.
                </p>
              </div>
            </div>

            <div>
              <span>✦</span>

              <div>
                <strong>Easy Booking</strong>

                <p>
                  Choose your service and preferred
                  appointment time.
                </p>
              </div>
            </div>

          </div>

          <a
            href="https://wa.me/919003017003"
            target="_blank"
            rel="noreferrer"
            className="appointment-whatsapp"
          >
             Chat on WhatsApp
          </a>

        </div>

        {/* FORM */}

        <div className="appointment-form-card">

          <div className="form-heading">

            <h3>Book Your Appointment</h3>

            <p>
              Fill in your details and select your preferred service.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* TITLE */}

            <div className="form-group">

              <label>Title</label>

              <select
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              >
                <option value="">
                  Select title
                </option>

                <option value="Mr.">
                  Mr.
                </option>

                <option value="Mrs.">
                  Mrs.
                </option>

                <option value="Ms.">
                  Ms.
                </option>

                <option value="Miss">
                  Miss
                </option>

                <option value="Dr.">
                  Dr.
                </option>

                <option value="Master">
                  Master
                </option>

                <option value="Child">
                  Child
                </option>

              </select>

            </div>

            {/* NAME + MOBILE */}

            <div className="form-row">

              <div className="form-group">

                <label>Your Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  title="Please enter a valid 10-digit Indian mobile number"
                  required
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>Category</label>

              <select
                value={category}
                onChange={handleCategoryChange}
                disabled={servicesLoading}
                required
              >

                <option value="">
                  {servicesLoading
                    ? "Loading categories..."
                    : categories.length > 0
                    ? "Choose a category"
                    : "No services available"}
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* SERVICE */}

            <div className="form-group">

              <label>Service</label>

              <select
                value={service}
                onChange={(e) =>
                  setService(e.target.value)
                }
                disabled={!category || servicesLoading}
                required
              >

                <option value="">
                  {!category
                    ? "Select category first"
                    : categoryServices.length === 0
                    ? "No services available"
                    : "Choose a service"}
                </option>

                {categoryServices.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

            {/* DATE + TIME */}

            <div className="form-row">

              <div className="form-group">

                <label>Preferred Date</label>

                <input
                  type="date"
                  value={appointmentDate}
                  min={today}
                  onChange={(e) =>
                    setAppointmentDate(e.target.value)
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>Preferred Time</label>

                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) =>
                    setAppointmentTime(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* MESSAGE */}

            <div className="form-group">

              <label>Message</label>

              <textarea
                rows="4"
                placeholder="Tell us anything you'd like us to know..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              ></textarea>

            </div>

            {/* SUCCESS */}

            {success && (
              <p className="appointment-success">
                ✓ {success}
              </p>
            )}

            {/* ERROR */}

            {error && (
              <p className="appointment-error">
                ✕ {error}
              </p>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              className="appointment-submit"
              disabled={loading || servicesLoading}
            >
              {loading
                ? "Submitting..."
                : "Book Appointment"}

              {!loading && <span>→</span>}
            </button>

            <small className="form-note">
              ✦ Your appointment request will be securely
              received by our clinic.
            </small>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Appointment;