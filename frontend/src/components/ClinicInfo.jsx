function ClinicInfo() {
  return (
    <section className="clinic-info-section" id="contact">
      <div className="clinic-info-container">

        <div className="clinic-info-content">

          <span className="clinic-tag">
            ✦ VISIT OUR CLINIC
          </span>

          <h2>
            We're Here to
            <br />
            <span>Take Care of You.</span>
          </h2>

          <p>
            Have questions about our treatments or want to plan your
            visit? Get in touch with V2 Aesthetic Skin and Hair Care Clinic.
          </p>

          <div className="clinic-details">

            {/* LOCATION */}
            <div className="clinic-detail">
              <div className="detail-icon">⌖</div>

              <div>
                <span>Clinic Location</span>

                <strong>
                  58, Savarirayalu Veethi,
                  <br />
                  near Vasanth & Co, MG Road Area,
                  <br />
                  Puducherry - 605001
                </strong>
              </div>
            </div>

            {/* PHONE */}
            <div className="clinic-detail">
              <div className="detail-icon">☎</div>

              <div>
                <span>Call / WhatsApp</span>

                <strong>
                  +91 9003017003
                </strong>
              </div>
            </div>

            {/* APPOINTMENT */}
            <div className="clinic-detail">
              <div className="detail-icon">◷</div>

              <div>
                <span>Appointments</span>

                <strong>
                  Book your preferred date & time
                </strong>
              </div>
            </div>

          </div>

          <div className="clinic-buttons">

            <a
              href="https://wa.me/919003017003"
              target="_blank"
              rel="noopener noreferrer"
              className="clinic-whatsapp"
            >
              WhatsApp us
            </a>

            <a
              href="tel:+919003017003"
              className="clinic-call"
            >
              ☎ Call Now
            </a>

          </div>

        </div>

        {/* CLICKABLE CLINIC IMAGE */}
        <a
          href="https://share.google/YVr9bXUDweSkHMG0d"
          target="_blank"
          rel="noopener noreferrer"
          className="clinic-map-card"
        >
          <div className="map-placeholder">

            <img
              src="/images/loc.jpeg"
              alt="V2 Aesthetic Skin and Hair Care Clinic"
            />

            <div className="map-overlay">

              <span>⌖</span>

              <div>
                <h3>Clinic Location</h3>

                <p>
                  Click to view on Google Maps →
                </p>
              </div>

            </div>

          </div>
        </a>

      </div>
    </section>
  );
}

export default ClinicInfo;