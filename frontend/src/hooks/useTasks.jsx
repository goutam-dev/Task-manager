import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

export function useTasks(statusFilter = "All", searchQuery = "", sortOrder = "newest") {
  const [allTasks, setAllTasks] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          API_PATHS.TASKS.GET_ALL_TASKS,
          { 
            params: { 
              status: "",
              search: searchQuery,
              sortBy: sortOrder
            } 
          }
        );
        console.log("Status Summary Data:", data );
        
        setStatusSummary(data.statusSummary || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const status = statusFilter === "All" ? "" : statusFilter;
        console.log(status);
        
        const { data } = await axiosInstance.get(
          API_PATHS.TASKS.GET_ALL_TASKS,
          { 
            params: { 
              status,
              search: searchQuery,
              sortBy: sortOrder
            } 
          }
        );
        console.log("Tasks Data:", data);
        
        setAllTasks(data.tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    fetchTasks();
  }, [statusFilter, searchQuery, sortOrder]);

  return { allTasks, statusSummary, loading };
}
