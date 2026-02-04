import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { addMentors} from "../Redux/userSlice";
import axios from "axios";

function useGetMentors() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/auth/getmentors`, {
          withCredentials: true,
        });
        console.log(result)
        dispatch(addMentors(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
}

export default useGetMentors;
