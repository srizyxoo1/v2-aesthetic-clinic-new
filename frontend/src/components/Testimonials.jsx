import { useEffect, useState } from "react";

const API_URL =
  "https://v2-aesthetic-clinic-backend-production.up.railway.app";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/api/testimonials`);

        if (!response.ok) {
          throw new Error("Failed to load testimonials");
        }

        const data = await response.json();

        const activeTestimonials = data.filter(
          (testimonial) => testimonial.active
        );

        setTestimonials(activeTestimonials);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        setTestimonials([]);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-heading">
        <span>04 • CLIENT EXPERIENCES</span>

        <h2>What Our Clients Say</h2>

        <p>
          Real experiences from our clients who trusted V2 Aesthetic
          for their beauty, skin, hair and wellness needs.
        </p>
      </div>

      <div className="testimonials-scroll">
        {testimonials.map((testimonial) => (
          <article
            className="testimonial-card"
            key={testimonial.id}
          >
            <div className="stars">
              {"★".repeat(testimonial.rating || 5)}
            </div>

            <p className="testimonial-review">
              “{testimonial.review}”
            </p>

            <div className="testimonial-bottom">
              <div className="testimonial-user">
                <div className="user-avatar">
                  {testimonial.customerName?.charAt(0)}
                </div>

                <div>
                  <h3>{testimonial.customerName}</h3>
                  <span>{testimonial.service}</span>
                </div>
              </div>

              {testimonial.googleReviewLink && (
                <a
                  href={testimonial.googleReviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="google-review-link"
                >
                  View on Google →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {testimonials.length > 0 && (
        <div className="scroll-hint">
          ← Swipe / Scroll to explore reviews →
        </div>
      )}
    </section>
  );
}

export default Testimonials;