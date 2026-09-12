import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

function SpaWellness() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchSpaServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/services"
        );

        if (!response.ok) {
          throw new Error("Unable to load spa services");
        }

        const data = await response.json();

        const spaServices = data
          .filter(
            (service) =>
              service.active &&
              service.category?.trim().toLowerCase() === "spa & wellness"
          )
          .map((service) => {
            let imagePath = service.image?.trim();

          

if (imagePath) {
  imagePath = imagePath.replace(/\\/g, "/");

  // Remove Windows/project folder part
  imagePath = imagePath.replace(/^frontend\/public/i, "");

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

        setServices(spaServices);
      } catch (error) {
        console.error("Unable to load spa services:", error);
        setServices([]);
      }
    };

    fetchSpaServices();
  }, []);

  return (
    <section className="services-section" id="spa">
      <div className="services-heading">
        <div>
          <span>01 • BEAUTY & WELLNESS</span>
          <h2>Moments of Wellness</h2>
        </div>

        <p>
          Discover our carefully selected skin, hair, beauty and wellness
          treatments designed for your comfort and care.
        </p>
      </div>

      <div className="services-scroll">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant="default"
          />
        ))}
      </div>

      {services.length > 0 && (
        <div className="scroll-hint">
          ← Scroll to explore more services →
        </div>
      )}
    </section>
  );
}

export default SpaWellness;