/**
 * HostDetails — legacy route handler
 *
 * The app previously had two host-profile routes:
 *   /host-details/:hostId  → HostDetails  (mock data only)
 *   /host/:hostId          → HostProfile  (real API)
 *
 * All links in PropertyDetails, Bookings, etc. already point to /host/:hostId.
 * This component exists only to catch any stale /host-details/:hostId URLs and
 * immediately redirect them to the real profile page.
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HostDetails = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect immediately — replace so the back button skips this page
    navigate(`/host/${hostId}`, { replace: true });
  }, [hostId, navigate]);

  return null;
};

export default HostDetails;
