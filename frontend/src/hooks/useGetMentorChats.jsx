import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { addUserData } from "../Redux/userSlice";
import axios from "axios";
import { setCompletedChats, setPendingChats } from "../Redux/chatSlice";

function useGetMentorChats() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const result = await axios.get(`${serverUrl}/api/chats/get-mentor-chats`, {
          withCredentials: true,
        });
        const allChats=result.data
        const completedChats=allChats.filter(c=>c.status=="completed")
        const pendingChats=allChats.filter(c=>c.status!="completed")
        dispatch(setPendingChats(pendingChats))
        dispatch(setCompletedChats(completedChats))
        

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
}

export default useGetMentorChats;
