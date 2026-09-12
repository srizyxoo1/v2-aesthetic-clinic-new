import { useEffect, useState } from "react";

function Treatments() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/services"
        );

        if (!response.ok) {
          throw new Error("Unable to load treatments");
        }

        const data = await response.json();

        const treatmentData = data
          .filter(
            (service) =>
              service.active &&
              service.category?.trim().toLowerCase() === "treatment"
          )
          .map((service) => {
            let imagePath = service.image?.trim();

            if (imagePath) {
              imagePath = imagePath.replace(/\\/g, "/");

              imagePath = imagePath.replace(
                /^frontend\/public/i,
                ""
              );

              if (
                !imagePath.startsWith("/") &&
                !imagePath.startsWith("http")
              ) {
                imagePath = `/${imagePath}`;
              }
            }

            return {
              ...service,
              image: imagePath,
            };
          });

        setTreatments(treatmentData);
      } catch (error) {
        console.error("Unable to fetch treatments:", error);
        setTreatments([]);
      }
    };

    fetchTreatments();
  }, []);

  return (
    <section
      className="treatments-section"
      id="treatments"
    >
      <div className="treatments-heading">
        <div>
          <span>02 • OUR TREATMENTS</span>
          <h2>Latest Treatments</h2>
        </div>

        <p>
          Advanced treatments designed to care for your
          skin, hair and overall appearance.
        </p>
      </div>

      <div className="treatments-scroll">
        {treatments.map((treatment) => {
          const whatsappMessage = encodeURIComponent(
            `Hi, I would like to book ${treatment.name} at V2 Aesthetic Skin and Hair Care Clinic.`
          );

          return (
            <article
              className="treatment-card"
              key={treatment.id}
            >
              <div
                className="treatment-image"
                style={{
                  backgroundImage: `url("${
                    treatment.image || "/images/hero.jpg"
                  }")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <span>{treatment.category}</span>
                <div>V2 Aesthetic</div>
              </div>

              <div className="treatment-content">
                <div className="treatment-meta">
                  <span>
                    {treatment.duration
                      ? `${treatment.duration} MINS`
                      : ""}
                  </span>

                  <strong>
                    ₹
                    {Number(
                      treatment.price || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <h3>{treatment.name}</h3>

                <p>{treatment.description}</p>

                <div className="treatment-actions">
                  <a
                    href="#booking"
                    className="treatment-book-btn"
                  >
                    For Appointment 
                  </a>

                  <a
                    href={`https://wa.me/919003017003?text=${whatsappMessage}`}
                    className="treatment-whatsapp-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Enquiry

                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {treatments.length > 0 && (
        <div className="treatments-scroll-hint">
          ← Scroll to explore more treatments →
        </div>
      )}
    </section>
  );
}

export default Treatments;