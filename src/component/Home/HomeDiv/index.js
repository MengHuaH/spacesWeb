import React, { useReducer, useState, useEffect } from 'react';
import RoomItem from './RoomItem';
import { Card, Flex, Modal, Table, Row, Col, Switch, Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import mqtt from 'mqtt';
import { Room, RoomClient } from 'api';

const initialState = {
  roomListData: [],
  room: Room,
  isModalOpen: false,
  isMOpen:false,
  isDOpen:false,
}

var mqtt_url = "ws://101.33.233.99/mqtt";
var opts = { username: "admin", password: "mhh1112", port: 8083, }

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
  }
]

const data = [
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 0
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 1,
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 2
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 3
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 4
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 5
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 6
  },
  {
    name: 1,
    money: 10,
    clientID: 1,
    key: 7
  },
]

function reducer(state, action) {
  switch (action.type) {
    case 'changed_roomListData': {
      return {
        ...state,
        roomListData: action.data
      };
    }
    case 'changed_isModalOpen': {
      return {
        ...state,
        isModalOpen: action.data
      };
    }
    case 'changed_room': {
      return {
        ...state,
        room: action.data
      };
    }
    case 'changed_isMOpen': {
      return {
        ...state,
        isMOpen: action.data
      };
    }
    case 'changed_isDOpen': {
      return {
        ...state,
        isDOpen: action.data
      };
    }
  }
}

const HomeDiv = ({ props }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [client, setClient] = useState(null)
  const { roomListData, isModalOpen, room, isDOpen, isMOpen } = state

  function isJson(vlaue) {
    try {
      var newVlaue = JSON.parse(vlaue)
      return newVlaue
    } catch (error) {
      return []
    }
  }

  function onShowModal(value) {
    dispatch({ type: 'changed_room', data: value })
    dispatch({ type: 'changed_isModalOpen', data: true })
    console.log(room)
  }
  function onCancel(){
    dispatch({ type: 'changed_room', data: initialState.room })
    dispatch({ type: 'changed_isModalOpen', data: false })
  }

  function onMState(){
    client.publish(room.clientId, "M_on", { qos: 0 });
    dispatch({ type: 'changed_isMOpen', data: true })
    setTimeout(() => {
      dispatch({ type: 'changed_isMOpen', data: false })
    }, 10000);
  }

  async function  onDState(e){
    var dState
    var newRoom = room
    if(e){
      dState = "D_on"
      newRoom.powerSupply = 1
    }else{
      dState = "D_off"
      newRoom.powerSupply = 0
    }
    console.log(newRoom)
    var roomClient = new RoomClient()
    await roomClient.updateRoom(newRoom)
    props.getRoomList({ pageNumber: 1, pageSize: 100 })
    client.publish(room.clientId, dState, { qos: 0 });
    dispatch({ type: 'changed_isDOpen', data: true })
    setTimeout(() => {
      dispatch({ type: 'changed_isDOpen', data: false })
    }, 2000);
  }
  useEffect(() => {
    dispatch({ type: 'changed_roomListData', data: props.roomListData })
    console.log(roomListData)
    const client = mqtt.connect(mqtt_url, opts);
    setClient(client)
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('esp32/test'); // 替换为你的主题
      client.subscribe('esp32/test2');
    });

    client.on('message', (topic, message) => {
      // 收到消息后更新组件状态
      var mes = isJson(message.toString())
      //console.log(mes)
      for (let i = 0; i < roomListData.length; i++) {
        if (roomListData[i].clientId == mes?.topic) {
          var newRoom = roomListData[i]
          newRoom.personnelSituation = mes.HW_State
          roomListData[i] = newRoom
          dispatch({ type: 'changed_roomListData', data: roomListData })
        }
      }

    });

    return () => {
      // 组件卸载时断开连接
      client.end();
    };
  }, [props]);

  return (
    <>
      <Flex wrap="wrap" gap="small">
        {
          roomListData?.map((value, key) =>
            <RoomItem props={{ data: value, mqttClient: client }} onClick={() => onShowModal(value)} key={key} ></RoomItem>
          )
        }
      </Flex>
      <Modal
        title={room?.name}
        open={isModalOpen}
        closable={true}
        onCancel={() => onCancel()}
        footer={null}
        style={{ overflow: 'hidden' }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            position: ['none', 'none'],
          }}
          scroll={{
            y: 240,
          }}
          footerBg='#f0f0f0'
          bordered
        />
        <Card
          title='房间控制'
          bordered={false}
          style={{
            backgroundColor: 'rgb(146,229,229)',
            boxShadow: '24px 10px 0px 10px rgb(146,229,229), -24px 10px 0px 10px rgb(146,229,229)',
            padding: '0px',
            borderRadius: '0px 0px 10px 10px',
            marginTop: '20px'
          }}
        >
          <Row>
            <Col span={3}>房门：</Col>
            <Col span={9}><Button disabled={isMOpen} type="primary" shape="circle" icon={<PoweroffOutlined  />} size='small' onClick={() => onMState()}/></Col>
            <Col span={3}>电源：</Col>
            <Col span={9}><Switch checkedChildren="开启" unCheckedChildren="关闭" disabled={isDOpen} checked={room.powerSupply == 1 ? true : false} onClick={(e) => onDState(e)}/></Col>
          </Row>
        </Card>
      </Modal>
    </>
  )
}
export default HomeDiv;