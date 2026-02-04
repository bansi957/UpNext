import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { addUserData } from "../Redux/userSlice";
import axios from "axios";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/auth/getcurrentuser`, {
          withCredentials: true,
        });
        console.log(result)
        dispatch(addUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
}

export default useGetCurrentUser;
