import { createSlice } from '@reduxjs/toolkit';

const userSlice  = createSlice({
  name:"user",
  initialState:{
    userData:null,
    mentors:[],
    questions:[],
    requests:[],
    activeChats:[],
    unreadMessages:0
  },
  reducers:{
    addUserData(state,action){
        state.userData = action.payload;
    },
    addMentors(state,action){
        state.mentors=action.payload
      },

    addQuestions(state,action){
     state.questions=action.payload
    },
    addQuestion(state,action){
      state.questions.unshift(action.payload)
    },
   deleteQuestion(state, action) {
  const questionId = action.payload;
  state.questions = state.questions.filter(
    (q) => q._id !== questionId
  );
},
setActiveChats(state, action) {
  state.activeChats = action.payload;
},
setUnreadMessages(state, action) {
  state.unreadMessages = action.payload;
},
  setRequests(state,action){
    state.requests=action.payload
  },
  addRequest(state,action){
      state.requests.unshift(action.payload)
    },

  }   
  
  
})

export const {addRequest,setRequests,addUserData,addMentors,addQuestions,addQuestion,deleteQuestion,setActiveChats,setUnreadMessages} = userSlice.actions;
export default userSlice.reducer;