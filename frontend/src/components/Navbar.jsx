function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <img
          src="/images/icon.jpeg"
          alt="V2 Aesthetic"
          className="logo-image"
        />
        {/* <h1>V2</h1><h2>Aesthetic</h2> */}
      </div>

      <div className="nav-links">
        <a href="/" className="active">Home</a>
        <a href="#doctor">Doctor Consultation</a>
        <a href="#spa">Spa & Wellness</a>
        <a href="#bridal">Bridal Makeup</a>
        <a href="#hair">Hair Care</a>
        <a href="#booking">Book Online</a>
      </div>

      <div className="nav-actions">

        <a
          href="https://wa.me/919003017003"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          whatsapp
        </a>

        <a
          href="#booking"
          className="book-btn"
        >
          Book Now
        </a>

      </div>

    </nav>
  );
}

export default Navbar;