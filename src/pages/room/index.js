
import { useEffect, useReducer } from 'react';
import Layout from '../layout.js';
import { RoomClient } from 'api';
import { Card } from '@/tools/index.js';
import { Button, Input, message, Modal, Col, Row, } from 'antd';
import { RoomList } from '@/component'

const { Search } = Input


const initialState = {
  room: {
    name: 0,
    money: 0,
    clientId:''
  },
  roomListData: [],
  isModalOpen: false,
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
    case 'getOne_room': {
      action.data['key'] = 1
      return {
        ...state,
        roomListData: [action.data]
      };
    }
    case 'changed_isModalOpen': {
      return {
        ...state,
        isModalOpen: action.data,
        moneyInput: 0,
      };
    }
    case 'changed_room': {
      return {
        ...state,
        room: action.data
      };
    }
    case 'def_room': {
      return {
        ...state,
        user: {
          name: '',
          money: 0
        }
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const { room, roomListData, isModalOpen,  } = state

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

  async function createRoom() {
    try {
      var res = new RoomClient()
      await res.createRoom(state.room)
      message.success('创建成功')
      dispatch({ type: 'def_room' })
      getRoomList({ pageNumber: 1, pageSize: 10 })
    }
    catch (error) {
      message.error('创建失败')
      console.log(error)
    }
  }

  async function handleOk() {
    createRoom()
    dispatch({ type: 'changed_room', data: initialState.room })
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function handleCancel() {
    dispatch({ type: 'changed_room', data: initialState.room })
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function onChange(e, type) {
    dispatch({
      type: 'changed_room', data: {
        name: type == 'roomName' ? e.target.value : state.room?.name,
        money: type == 'money' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.room?.money,
        clientId: type == 'clientId' ? e.target.value : state.room?.clientId,
      }
    })
  };

  function changedPage(page, pageSize) {
    dispatch({
      type: 'changed_page', data: {
        pageNumber: page,
        totalCount: state.pages.totalCount,
        totalPages: state.pages.totalPages,
        pageSize: pageSize
      }
    })
    getRoomList({ pageNumber: page, pageSize: pageSize })
  }
  useEffect(() => { getRoomList({ pageNumber: 1, pageSize: 10 }); }, [])
  return (
    <Layout props={{ menuKey: 'room' }}>
      <Card
        title={<Search placeholder="房间名称" style={{ width: '200px' }}
          onSearch={(value) => getRoomList({ RoomName: value, pageNumber: state.pages.pageNumber, pageSize: state.pages.pageSize })}></Search>}
        type='noBorder'
        extra={<Button onClick={() => dispatch({ type: 'changed_isModalOpen', data: true })}>创建房间</Button>}
      >
        <RoomList props={{ data: state.roomListData, pages: state.pages }} getRoomList={getRoomList} changedPage={(page, pageSize) => changedPage(page, pageSize)} />
      </Card>
      <Modal
        title="创建房间"
        open={state.isModalOpen}
        onOk={() => handleOk()}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消">
        <Row style={{ padding: '20px 50px 10px 50px' }}>
          <Col span={7} style={{ textAlign: 'right', lineHeight: "31.6px" }}><span>房间名称：</span></Col>
          <Col span={17}><Input value={state.room.name ? state.room.name : ""} onChange={(e) => onChange(e, 'roomName')} /></Col>
        </Row>
        <Row style={{ padding: '10px 50px 20px 50px' }}>
          <Col span={7} style={{ textAlign: 'right', lineHeight: "31.6px" }}><span>价格（小时）：</span></Col>
          <Col span={17}><Input value={state.room.money} onChange={(e) => onChange(e, 'money')} /></Col>
        </Row>
        <Row style={{ padding: '10px 50px 20px 50px' }}>
          <Col span={7} style={{ textAlign: 'right', lineHeight: "31.6px" }}><span>房控设备ID：</span></Col>
          <Col span={17}><Input value={room.clientId} onChange={(e) => onChange(e, 'clientId')} /></Col>
        </Row>
      </Modal>
    </Layout>

  )
}
export default Index