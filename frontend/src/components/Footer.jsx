function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/images/icon.jpeg"
              alt="V2 Aesthetic Logo"
              className="footer-logo-image"
            />

            <div>
              <h3>V2 Aesthetic</h3>
              <span>SKIN & HAIR CARE CLINIC</span>
            </div>
          </div>

          <p>
            Premium skin, hair, beauty and wellness care,
            thoughtfully designed for you.
          </p>

          <a
            href="https://wa.me/919003017003"
            target="_blank"
            rel="noreferrer"
            className="footer-whatsapp"
          >
             WhatsApp 
          </a>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">
          <h4>Quick Links</h4>

          <a href="/">Home</a>
          <a href="#booking">Book Appointment</a>
          <a href="#contact">Contact Us</a>
           <a href="/admin/login">Admin Login</a>
        </div>

        {/* SERVICES */}
        <div className="footer-column">
          <h4>Our Services</h4>

          <a href="#doctor">Doctor Consultation</a>
          <a href="#spa">Spa & Wellness</a>
          <a href="#bridal">Bridal Makeup</a>
          <a href="#hair">Hair Care</a>
        </div>

        {/* CONTACT */}
        <div className="footer-column footer-contact">
          <h4>Get In Touch</h4>

          <p>
            ☎ <span>+91 9003017003</span>
          </p>

          <p>
            ✦ <span>Appointments Available</span>
          </p>

          <p>
            ⌖ <span>Clinic location will be added soon</span>
          </p>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">

        <center><p>
          © {new Date().getFullYear()} V2 Aesthetic Skin and Hair Care Clinic.
          All rights reserved.
        </p></center>

        

      </div>

    </footer>
  );
}

export default Footer;