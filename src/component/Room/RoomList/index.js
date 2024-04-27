import React, { useReducer } from 'react';
import { Space, Table, Button, Modal, Col, Row, Input, message, Pagination } from 'antd';
import { Room, RoomClient } from 'api';

const initialState = {
  room: Room,
  isModalOpen: false,
  modalType: 'room',
  moneyInput: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_room': {
      return {
        ...state,
        room: action.data
      };
    }
    case 'def_room': {
      return {
        ...state,
        room: Room
      };
    }
    case 'changed_isModalOpen': {
      return {
        ...state,
        isModalOpen: action.data,
        moneyInput: 0,
      };
    }
    case 'changed_modalType': {
      return {
        ...state,
        modalType: action.data
      };
    }
    case 'changed_moneyInput': {
      return {
        ...state,
        moneyInput: action.data
      };
    }
  }
}

const RoomList = ({ props, getRoomList, changedPage }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const columns = [
    {
      title: '房间名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格（小时）',
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: '房控设备ID',
      dataIndex: 'clientId',
      key: 'clientId',
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => changedRoom(record)}>修改信息</Button>
          <Button type="primary" onClick={() => deleteRoom(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  function changedRoom(value) {
    dispatch({ type: 'changed_room', data: value })
    dispatch({ type: 'changed_modalType', data: 'room' })
    dispatch({ type: 'changed_isModalOpen', data: true })
  }
  async function deleteRoom(value) {
    try {
      var client = new RoomClient();
      await client.deleteRoom(value.id)
      getRoomList({pageNumber:props.pages.pageNumber, pageSize:props.pages.pageSize})
      message.success('删除成功')
    } catch (error) {
      message.error('删除失败')
      console.log(error)
    }
  }

  async function updateClient(putRoom) {
    if (state.moneyInput == 0 && state.modalType == 'money') return;
    try {
      var client = new RoomClient();
      await client.updateRoom(putRoom)
      getRoomList({pageNumber:props.pages.pageNumber, pageSize:props.pages.pageSize})
      message.success('修改成功')
    } catch (error) {
      message.error('修改失败')
      console.log(error)
    }
  }
  async function handleOk() {
    var putRoom = {
      id: state.room.id,
      name: state.room.name,
      money: state.room.money
    } 
    updateClient(putRoom)
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function handleCancel() {
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function onChange(e, type) {
    dispatch({
      type: 'changed_room', data: {
        id: state.room.id,
        key: state.room.key,
        money: type == 'money' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.room.money,
        name: type == 'name' ? e.target.value : state.room.name,
      }
    }) 
  };
  return (
    <>
      <Table
        columns={columns}
        dataSource={props?.data}
        pagination={{
          simple: true,
          pageNumber: props.pages.pageNumber,
          pageSize: props.pages.pageSize,
          total: props.pages.totalCount,
          onChange: (page, pageSize) => changedPage(page, pageSize)
        }} />
      <Modal
        title={state.modalType == 'room' ? "修改信息" : "充值"}
        open={state.isModalOpen}
        onOk={() => handleOk()}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消">
        <Row style={{ padding: '20px 50px 10px 50px' }}>
          <Col span={7} style={{ textAlign: 'right', lineHeight: "31.6px" }}><span>房间名称：</span></Col>
          <Col span={17}><Input value={state.room.name} onChange={(e) => onChange(e, 'name')} /></Col>
        </Row>
        <Row style={{ padding: '10px 50px 20px 50px' }}>
          <Col span={7} style={{ textAlign: 'right', lineHeight: "31.6px" }}><span>价格（小时）：</span></Col>
          <Col span={17}><Input value={state.room.money} onChange={(e) => onChange(e, 'money')} /></Col>
        </Row>
      </Modal>
    </>
  )
}
export default RoomList;