import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

const API_URL =
  "https://v2-aesthetic-clinic-backend-production.up.railway.app";

function HairCare() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchHairServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);

        if (!response.ok) {
          throw new Error("Unable to load hair services");
        }

        const data = await response.json();

        const hairServices = data.filter(
          (service) =>
            service.active &&
            service.category?.trim().toLowerCase() === "hair care"
        );

        setServices(hairServices);
      } catch (error) {
        console.error("Unable to load hair services:", error);
        setServices([]);
      }
    };

    fetchHairServices();
  }, []);

  return (
    <section className="hair-section" id="hair">
      <div className="hair-heading">
        <div>
          <span>03 • HAIR CARE & STYLING</span>
          <h2>Hair Care & Styling</h2>
        </div>

        <p>
          From nourishing treatments to beautiful styling, give your hair
          the professional care it deserves.
        </p>
      </div>

      <div className="hair-scroll">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant="hair"
          />
        ))}
      </div>

      {services.length > 0 && (
        <div className="scroll-hint">
          ← Swipe / Scroll to explore more →
        </div>
      )}
    </section>
  );
}

export default HairCare;