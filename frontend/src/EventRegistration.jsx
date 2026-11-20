
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock, Users, CheckCircle, Ticket } from "lucide-react";

const API = "http://localhost:8080/api";

function EventRegistration() {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [eventsResponse, registrationsResponse] = await Promise.all([
        fetch(`${API}/events`),
        fetch(`${API}/event-registrations/my`, {
          credentials: "include",
        }),
      ]);

      if (!eventsResponse.ok) {
        throw new Error("Unable to load events.");
      }

      if (registrationsResponse.status === 401) {
        throw new Error("Please log in again to view your registrations.");
      }

      if (!registrationsResponse.ok) {
        throw new Error("Unable to load your registrations.");
      }

      const eventsData = await eventsResponse.json();
      const registrationsData = await registrationsResponse.json();

      setEvents(eventsData);
      setMyRegistrations(registrationsData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const registerForEvent = async (eventId) => {
    setMessage("");
    setError("");
    setRegistering(eventId);

    try {
      const response = await fetch(
        `${API}/event-registrations/${eventId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(data.message || "Successfully registered!");
      await loadData();
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setRegistering(null);
    }
  };

  const isRegistered = (eventId) =>
    myRegistrations.some((registration) => registration.eventId === eventId);

  if (loading) {
    return <div className="page-content">Loading events...</div>;
  }

  return (
    <div className="event-registration-page">
      <div className="event-registration-header">
        <div>
          <h2>Explore Campus Events</h2>
          <p>Discover events and reserve your place on campus.</p>
        </div>
        <div className="event-registration-count">
          <Ticket size={20} />
          <span>{myRegistrations.length} Registered</span>
        </div>
      </div>

      {message && (
        <div className="event-alert success">
          <CheckCircle size={18} />
          {message}
        </div>
      )}

      {error && <div className="event-alert error">{error}</div>}

      <h3 className="event-section-title">Available Events</h3>

      {events.length === 0 ? (
        <div className="event-empty">
          <CalendarDays size={36} />
          <h3>No events available</h3>
          <p>New campus events will appear here.</p>
        </div>
      ) : (
        <div className="student-events-grid">
          {events.map((event) => {
            const registered = isRegistered(event.id);

            return (
              <article className="student-event-card" key={event.id}>
                <div className="student-event-top">
                  <span className="event-category">
                    {event.category || "Campus Event"}
                  </span>
                  <CalendarDays size={22} />
                </div>

                <h3>{event.title}</h3>
                <p className="student-event-description">
                  {event.description || "Join this exciting campus event."}
                </p>

                <div className="student-event-details">
                  <span>
                    <CalendarDays size={16} />
                    {event.eventDate}
                  </span>
                  <span>
                    <Clock size={16} />
                    {event.eventTime}
                  </span>
                  <span>
                    <MapPin size={16} />
                    {event.venue}
                  </span>
                  <span>
                    <Users size={16} />
                    Capacity: {event.capacity ?? "Not specified"}
                  </span>
                </div>

                <button
                  className={`event-register-btn ${registered ? "registered" : ""}`}
                  onClick={() => registerForEvent(event.id)}
                  disabled={registered || registering === event.id}
                >
                  {registered
                    ? "Already Registered"
                    : registering === event.id
                    ? "Registering..."
                    : "Register for Event"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      <h3 className="event-section-title my-events-title">
        My Registered Events
      </h3>

      {myRegistrations.length === 0 ? (
        <div className="event-empty">
          <Ticket size={32} />
          <p>You haven't registered for any events yet.</p>
        </div>
      ) : (
        <div className="my-registered-events">
          {myRegistrations.map((registration) => (
            <div
              className="registered-event-row"
              key={registration.registrationId}
            >
              <div>
                <strong>{registration.title}</strong>
                <span>
                  {registration.eventDate} · {registration.venue}
                </span>
              </div>
              <span className="registered-status">
                <CheckCircle size={15} /> Registered
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventRegistration;
