import React, { useReducer } from 'react';
import { Space, Table, Button, Modal, Col, Row, Input, message, Pagination } from 'antd';
import { UserClient, Users } from 'api';

const initialState = {
  user: Users,
  isModalOpen: false,
  modalType: 'user',
  moneyInput: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_user': {
      return {
        ...state,
        user: action.data
      };
    }
    case 'def_user': {
      return {
        ...state,
        user: Users
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

const UserList = ({ props, getUserList, changedPage }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const columns = [
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '账户余额',
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => changedUser(record)}>修改信息</Button>
          <Button type="primary" onClick={() => changedMoney(record)}>充值</Button>
        </Space>
      ),
    },
  ];

  function changedUser(value) {
    dispatch({ type: 'changed_user', data: value })
    dispatch({ type: 'changed_modalType', data: 'user' })
    dispatch({ type: 'changed_isModalOpen', data: true })
  }
  function changedMoney(value) {
    dispatch({ type: 'changed_user', data: value })
    dispatch({ type: 'changed_modalType', data: 'money' })
    dispatch({ type: 'changed_isModalOpen', data: true })
  }

  async function updateClient(putUser) {
    if (state.moneyInput == 0 && state.modalType == 'money') return;
    try {
      var client = new UserClient();
      tate.modalType == 'user' ? await client.updateUser(putUser) : await client.updateMoney(putUser)
      getUserList(props.pages.pageNumber,props.pages.pageSize)
      message.success(state.modalType == 'user' ? '修改成功' : '充值成功')
    } catch (error) {
      message.error(state.modalType == 'user' ? '修改失败' : '充值失败')
      console.log(error)
    }
  }
  async function handleOk() {
    var putUser = state.modalType == 'user' ? {
      id: state.user.id,
      name: state.user.name,
      phoneNumber: state.user.phoneNumber
    } : {
      id: state.user.id,
      money: state.user.money + state.moneyInput
    }
    updateClient(putUser)
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function handleCancel() {
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function onChange(e, type) {
    state.modalType == 'user' ?
      dispatch({
        type: 'changed_user', data: {
          id: state.user.id,
          key: state.user.key,
          money: state.user.money,
          name: type == 'name' ? e.target.value : state.user.name,
          phoneNumber: type == 'phoneNumber' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.user.phoneNumber
        }
      }) :
      dispatch({ type: 'changed_moneyInput', data: Number(e.target.value) ? Number(e.target.value) : 0 })
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
        title={state.modalType == 'user' ? "修改信息" : "充值"}
        open={state.isModalOpen}
        onOk={() => handleOk()}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消">
        {state.modalType == 'user' ?
          <Row style={{ padding: '20px 50px' }}>
            <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>用户名：</span></Col>
            <Col span={19}><Input value={state.user.name} onChange={(e) => onChange(e, 'name')} /></Col>
          </Row> : ''}
        <Row style={{ padding: '20px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>{state.modalType == 'user' ? '手机号码：' : '充值金额：'}</span></Col>
          <Col span={19}><Input value={state.modalType == 'user' ? state.user.phoneNumber : state.moneyInput} onChange={(e) => onChange(e, 'phoneNumber')} /></Col>
        </Row>
      </Modal>
    </>
  )
}
export default UserList;