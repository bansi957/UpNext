import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { addMentors} from "../Redux/UserSlice";
import axios from "axios";

function useGetMentors() {
  const dispatch = useDispatch();
  const {userData}=useSelector(state=>state.user)
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
  }, [userData]);
}

export default useGetMentors;
