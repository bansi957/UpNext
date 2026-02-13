import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addQuestions } from "../Redux/UserSlice";

function useMyQueriesById() {
    const dispatch=useDispatch()
    const userData=useSelector(state=>state.user)
  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/questions/myquestions`,
          {
            withCredentials: true,
          }
        );
        console.log(result)
        dispatch(addQuestions(result.data));
      } catch (error) {
        console.log(error);
        
      } 
    };

    fetchQuery()
  }, [userData?._id]);

}

export default useMyQueriesById;