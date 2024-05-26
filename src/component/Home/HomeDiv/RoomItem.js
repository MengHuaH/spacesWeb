import React, { useEffect, useReducer } from 'react';
import { Card, Row, Col } from 'antd';
import style from './style/roomItem.module.css'

const initialState = {
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
  }
}

const RoomItem = ({ props, onClick=()=>{}}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  function roomState(vlaue) {
    if(vlaue.length == 0){
      return {
        text:'无人使用',
        className:'',
      }
    }
    var status = 0
    for (let i = 0; i < vlaue.length; i++) {
      if(vlaue[i].endTime > new Date()){
        if(vlaue[i].orderStatus == 1){
          status = 1
          i = vlaue.length
        }
        else if(vlaue[i].orderStatus == 2){
          status = 2
        }
      }
    }
    if(status == 1){
      return {
        text:'正在使用',
        className:style.inUse,
      }
    }
    else if(status == 2){
      return {
        text:'有预约',
        className:style.appointment,
      }
    }else{
      return {
        text:'无人使用',
        className:'',
      }
    }
  }

  useEffect(() => {
  }, [])
  return (
    <>
      <Card
        title={props.data.name}
        style={{ width: '190px' }}
        extra={roomState(props.data?.orderGoods)?.text}
        className={roomState(props.data?.orderGoods)?.className}
        onClick={onClick}
        key={props.data}
      >
        <Row className={style.row}>
          <Col span={12} style={{ textAlign: 'right' }}>人员情况：</Col>
          <Col span={12} className={style.state}><div className={props.data.personnelSituation == 1 ? style.stateDiv + ' ' + style.state_color_green : style.stateDiv + ' ' + style.state_color_red}></div></Col>
        </Row>
        <Row className={style.row}>
          <Col span={12} style={{ textAlign: 'right' }}>电源：</Col>
          <Col span={12} className={style.state}><div className={props.data.powerSupply == 1 ? style.stateDiv + ' ' + style.state_color_green : style.stateDiv + ' ' + style.state_color_red}></div></Col>
        </Row>
      </Card>
    </>
  )
}
export default RoomItem;