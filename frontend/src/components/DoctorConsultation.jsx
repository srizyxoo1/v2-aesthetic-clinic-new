import { useEffect, useState } from "react";

function DoctorConsultation() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchDoctorServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/services"
        );

        if (!response.ok) {
          throw new Error("Unable to load doctor services");
        }

        const data = await response.json();

        const doctorServices = data.filter(
          (item) =>
            item.active === true &&
            item.category?.toLowerCase() ===
              "doctor consultation"
        );

        setServices(doctorServices);
      } catch (error) {
        console.error(
          "Unable to load doctor consultations:",
          error
        );

        setServices([]);
      }
    };

    fetchDoctorServices();
  }, []);

  const handleAppointmentClick = () => {
    const bookingSection =
      document.getElementById("booking");

    if (bookingSection) {
      bookingSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  if (services.length === 0) {
    return null;
  }

  return (
    <section
      className="doctor-section"
      id="doctor"
    >
      <div className="section-heading">

        <span>
          SPECIALIST DOCTOR CARE
        </span>

        <h2>
          Consult Our Skin & Hair Doctor
        </h2>

        <p>
          Get expert skin and hair consultation
          with personalized guidance and treatment
          recommendations.
        </p>

      </div>

      <div className="doctor-services-scroll">

        {services.map((service) => {

          /*
           * IMAGE
           * Admin Services-la save panna
           * image path-a direct-a use pannum.
           */
          const imageSrc = service.image
            ? service.image.startsWith("http")
              ? service.image
              : service.image.startsWith("/")
                ? service.image
                : `/images/${service.image}`
            : "/images/doctor.jpg";

          const price =
            service.price !== null &&
            service.price !== undefined
              ? `₹${Number(
                  service.price
                ).toLocaleString("en-IN")}`
              : "₹799";

          const duration =
            service.duration !== null &&
            service.duration !== undefined
              ? `${service.duration} Minutes`
              : "30 Minutes";

          const doctorName =
            service.name ||
            "Skin & Hair Doctor Consultation";

          const description =
            service.description ||
            "Get your skin and hair checked by an experienced medical doctor with personalized treatment guidance.";

          const whatsappMessage =
            encodeURIComponent(
              `Hi, I would like to book ${doctorName} at V2 Aesthetic Skin and Hair Care Clinic.`
            );

          return (
            <div
              className="doctor-card"
              key={service.id}
            >

              {/* IMAGE */}
              <div className="doctor-image">

                <img
                  src={imageSrc}
                  alt={doctorName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "/images/doctor.jpg";
                  }}
                />

                <span>
                  Senior Dermatologist
                </span>

              </div>

              {/* DETAILS */}
              <div className="doctor-details">

                <div className="doctor-top">

                  <div>

                    <small>
                      DOCTOR-IN-CLINIC SESSION
                    </small>

                    <h3>
                      {doctorName}
                    </h3>

                    <p>
                      MD Dermatologist & Hair Specialist
                    </p>

                  </div>

                  <strong>
                    ● Available Today
                  </strong>

                </div>

                <p className="doctor-description">
                  {description}
                </p>

                {/* PRICE + DURATION */}
                <div className="consultation-box">

                  <div>

                    <small>
                      CONSULTATION FEE
                    </small>

                    <h4>
                      {price}
                    </h4>

                  </div>

                  <div>

                    <small>
                      SESSION DURATION
                    </small>

                    <h4>
                      {duration}
                    </h4>

                  </div>

                </div>

                <small className="check-title">
                  WHAT WILL BE CHECKED:
                </small>

                <div className="check-items">

                  <div>

                    <b>◉</b>

                    <strong>
                      Acne & Pigmentation
                    </strong>

                    <span>
                      Dark spots, pimples & skin tone
                    </span>

                  </div>

                  <div>

                    <b>✂</b>

                    <strong>
                      Hair Fall & Scalp
                    </strong>

                    <span>
                      Dandruff, thinning & scalp check
                    </span>

                  </div>

                  <div>

                    <b>▣</b>

                    <strong>
                      Treatment Plan
                    </strong>

                    <span>
                      Exact diagnosis & care steps
                    </span>

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="doctor-buttons">

                  <a
                    href={`https://wa.me/919003017003?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doctor-whatsapp-btn"
                  >
                 Enquiry
                  </a>

                  <button
                    type="button"
                    onClick={handleAppointmentClick}
                    className="doctor-appointment-btn"
                  >
                    For Appointment 
                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>
    </section>
  );
}

export default DoctorConsultation;