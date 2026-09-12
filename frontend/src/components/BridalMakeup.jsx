import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

function BridalMakeup() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch( "https://v2-aesthetic-clinic-backend-production.up.railway.app")
      .then((response) => response.json())
      .then((data) => {
        const bridalServices = data.filter(
          (service) =>
            service.active &&
            service.category.toLowerCase() === "bridal makeup"
        );

        setServices(bridalServices);
      })
      .catch((error) => {
        console.error("Unable to load bridal services:", error);
      });
  }, []);

  return (
    <section className="bridal-section" id="bridal">
      <div className="bridal-heading">
        <div>
          <span>02 • BRIDAL & MAKEUP</span>
          <h2>Bridal & Party Makeup</h2>
        </div>

        <p>
          From your special day to every celebration, our beauty artists
          create elegant looks tailored to you.
        </p>
      </div>

      <div className="bridal-scroll">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant="bridal"
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

export default BridalMakeup;