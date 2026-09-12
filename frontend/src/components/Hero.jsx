import {
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaMapSigns,
} from "react-icons/fa";

function Hero() {
  return (
    <section className="hero" id="home">

      <div className="hero-content">

        <span className="hero-tag">
          ✦ SKIN • HAIR • BEAUTY • WELLNESS
        </span>

        <h1>
          Beauty, Wellness & Care.
          <br />
          <span>All in One Place.</span>
        </h1>

        <p>
          Premium skin, hair, beauty and wellness services
          designed to help you look and feel your best.
        </p>

        {/* HERO BUTTONS */}
        <div className="hero-buttons">

          {/* APPOINTMENT */}
          <a
            href="#booking"
            className="hero-book-btn"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              For Appointment <FaPaperPlane />
            </span>
          </a>


          {/* WHATSAPP ENQUIRY */}
          <a
            href="https://wa.me/919003017003"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-whatsapp-btn"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Enquiry <FaPaperPlane />
            </span>
          </a>


          {/* DIRECTION */}
          <a
            href="https://share.google/YVr9bXUDweSkHMG0d"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-location-btn"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Direction <FaMapSigns />
            </span>
          </a>

        </div>


        {/* HERO STATS */}
        <div className="hero-stats">

          <div>
            <strong>100%</strong>
            <span>Safe & Clean Clinic</span>
          </div>

          <div>
            <strong>₹799</strong>
            <span>Doctor Consultation</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>WhatsApp Booking</span>
          </div>

        </div>


        {/* SOCIAL */}
        <div className="hero-social">

          <span>STAY CONNECTED</span>

          <p>
            Follow V2 Aesthetic for beauty tips, treatment updates
            and the latest from our clinic.
          </p>

          <div className="hero-social-links">

            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/v2aesthetics.pondy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
              Instagram
            </a>


            {/* FACEBOOK */}
            <a
              href="https://www.facebook.com/61594152837831/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
              Facebook
            </a>

          </div>

        </div>

      </div>


      {/* IMAGE — UNCHANGED */}
      <div>
        {/* Your image section can stay commented/unchanged here */}
      </div>

    </section>
  );
}

export default Hero;