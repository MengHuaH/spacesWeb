
import { useEffect, useReducer } from 'react';
import Layout from '../layout.js';
import { HomeDiv } from '@/component';
import { RoomClient } from 'api';


const initialState = {
  roomListData: [],
  pages: {
    pageNumber: 1,
    totalCount: 0,
    totalPages: 1,
    pageSize: 5
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_roomListData': {
      action.data.items.map((vlaue, key) => {
        action.data.items[key]['key'] = action.data.items[key].id
      })
      return {
        ...state,
        roomListData: action.data.items
      };
    }
    case 'changed_page': {
      return {
        ...state,
        pages: action.data
      };
    }
  }
}



const Index = () => {
  const [state,dispatch] = useReducer(reducer,initialState)
  const { roomListData } = state

  async function getRoomList({ RoomName, pageNumber, pageSize, pages }) {
    try {
      var res = new RoomClient()
      var json = await res.getRoomWithPagination(RoomName, pageNumber, pageSize)
      dispatch({ type: 'changed_roomListData', data: json })
      dispatch({
        type: 'changed_page', data: {
          pageNumber: json.pageNumber,
          totalCount: json.totalCount,
          totalPages: json.totalPages,
          pageSize: 5
        }
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { getRoomList({ pageNumber: 1, pageSize: 100 }); }, [])
  return (
    <Layout props={{ menuKey: 'home' }}>
      <HomeDiv props={{ roomListData: roomListData, getRoomList: getRoomList }}></HomeDiv>
    </Layout>

  )
}
export default Index