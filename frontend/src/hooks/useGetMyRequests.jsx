
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, setRequests } from "../Redux/userSlice";
import { getSocket } from "../../socket";

function useGetMyRequestsById() {
    const dispatch=useDispatch()
    const {userData,requests}=useSelector(state=>state.user)
  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/questions/mentor-requests`,
          {
            withCredentials: true,
          }
        );
        console.log(result)
        dispatch(setRequests(result.data));
      } catch (error) {
        console.log(error);
        
      } 
    };

    fetchQuery()
  }, [userData?._id]);

}

export default useGetMyRequestsById;