import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addQuestions } from "../Redux/userSlice";

function useMyQueriesById() {
    const dispatch=useDispatch()

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
  }, []);

}

export default useMyQueriesById;