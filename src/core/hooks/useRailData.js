import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching rail data
 * 
 * @param {Function} fetchRails - Data fetching function
 * @param {Array} initialRails - Initial rail data
 * @param {string} sectionId - Section ID (for logging)
 * @returns {Object} - Veri durumu {rails, loading, error, setRails}
 */
const useRailData = (fetchRails, initialRails, sectionId) => {
  const [rails, setRails] = useState(initialRails);
  const [loading, setLoading] = useState(!!fetchRails);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    console.log("[useRailData] Fetching data for section:", sectionId);

    const fetchData = async () => {
      if (fetchRails) {
        try {
          setLoading(true);
          console.log("[useRailData] Loading started for:", sectionId);
          const data = await fetchRails();
          if (isMounted) {
            setRails(data);
            setError(null);
            console.log(
              "[useRailData] Loaded successfully for:",
              sectionId
            );
          }
        } catch (err) {
          if (isMounted) {
            setError("Failed to load data");
            console.error("[useRailData] Data fetch failed:", err);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
            console.log("[useRailData] Loading completed for:", sectionId);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      console.log("[useRailData] Cleanup for section:", sectionId);
    };
  }, [fetchRails, sectionId]);

  return { rails, loading, error, setRails };
};

export default useRailData;
