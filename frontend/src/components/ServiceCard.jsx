function ServiceCard({ service, variant = "default" }) {
  const getImagePath = (image) => {
    if (!image) {
      return "/images/hero.jpg";
    }

    let path = image.trim().replace(/\\/g, "/");

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    path = path.replace(/^frontend\/public/i, "");

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    return path;
  };

  const imageSrc = getImagePath(service.image);

  const formattedPrice =
    service.price != null &&
    service.price !== "" &&
    Number(service.price) > 0
      ? `₹${Number(service.price).toLocaleString("en-IN")}`
      : "";

  const duration =
    service.duration != null &&
    service.duration !== ""
      ? `${service.duration} MINS`
      : "";

  const whatsappMessage = encodeURIComponent(
    `Hi, I would like to enquire about ${service.name} at V2 Aesthetic Skin and Hair Care Clinic.`
  );

  /* =========================
     BRIDAL
  ========================= */
  if (variant === "bridal") {
    return (
      <article className="bridal-card">
        <div className="bridal-image">
          <img
            src={imageSrc}
            alt={service.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/hero.jpg";
            }}
          />

          <span>{service.category}</span>
        </div>

        <div className="bridal-content">
          <div className="bridal-price">
            <div>
              {duration && <small>{duration}</small>}

              {service.durationNote && (
                <em>{service.durationNote}</em>
              )}
            </div>

            <div>
              {formattedPrice && (
                <strong>{formattedPrice}</strong>
              )}

              {service.priceNote && (
                <em>{service.priceNote}</em>
              )}
            </div>
          </div>

          <h3>{service.name}</h3>

          <p>{service.description}</p>

          <div className="bridal-actions">
            <a
              className="bridal-book-btn"
              href="#booking"
            >
              For Appointment
            </a>

            <a
              className="bridal-whatsapp-btn"
              href={`https://wa.me/919003017003?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
               Enquiry
            </a>
          </div>
        </div>
      </article>
    );
  }

  /* =========================
     HAIR CARE
  ========================= */
  if (variant === "hair") {
    return (
      <article className="hair-card">
        <div className="hair-image">
          <img
            src={imageSrc}
            alt={service.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/hero.jpg";
            }}
          />

          <span>{service.category}</span>

          <div>V2 Aesthetic</div>
        </div>

        <div className="hair-content">
          <div className="hair-price">
            <div className="hair-duration-info">
              {duration && (
                <small>{duration}</small>
              )}

              {service.durationNote && (
                <em>{service.durationNote}</em>
              )}
            </div>

            <div className="hair-price-info">
              {formattedPrice && (
                <strong>{formattedPrice}</strong>
              )}

              {service.priceNote && (
                <em>{service.priceNote}</em>
              )}
            </div>
          </div>

          <h3>{service.name}</h3>

          <p>{service.description}</p>

          <div className="hair-actions">
            <a
              className="hair-book-btn"
              href="#booking"
            >
              For Appointment
            </a>

            <a
              className="hair-whatsapp-btn"
              href={`https://wa.me/919003017003?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
               Enquiry
            </a>
          </div>
        </div>
      </article>
    );
  }

  /* =========================
     DEFAULT
  ========================= */
  return (
    <div className="service-card">
      <div className="service-image">
        <img
          src={imageSrc}
          alt={service.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/hero.jpg";
          }}
        />

        <span>{service.category}</span>

        <div>V2 Aesthetic</div>
      </div>

      <div className="service-content">
        <div className="service-meta">
          <div>
            {duration && (
              <span>{duration}</span>
            )}

            {service.durationNote && (
              <small>{service.durationNote}</small>
            )}
          </div>

          <div>
            {formattedPrice && (
              <strong>{formattedPrice}</strong>
            )}

            {service.priceNote && (
              <small>{service.priceNote}</small>
            )}
          </div>
        </div>

        <h3>{service.name}</h3>

        <p>{service.description}</p>

       <div className="service-actions">
  <a
    className="service-whatsapp"
    href={`https://wa.me/919003017003?text=${whatsappMessage}`}
    target="_blank"
    rel="noopener noreferrer"
  >
     Enquiry
  </a>

  <a
    href="#booking"
    className="service-select"
  >
    For Appointment
  </a>
</div>
      </div>
    </div>
  );
}

export default ServiceCard;