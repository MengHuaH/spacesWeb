
import { useEffect, useReducer } from 'react';
import Layout from '../layout.js';
import { UserClient } from 'api';
import { Card } from '@/tools/index.js';
import { Button, Input, message, Modal, Col, Row, } from 'antd';
import { UserList } from '@/component'

const { Search } = Input


const initialState = {
  user: {
    userName: '',
    phoneNumber: 0,
    money: 0
  },
  userListData: [],
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
    case 'changed_userListData': {
      action.data.items.map((vlaue, key) => {
        action.data.items[key]['key'] = action.data.items[key].id
      })
      return {
        ...state,
        userListData: action.data.items
      };
    }
    case 'getOne_user': {
      action.data['key'] = 1
      return {
        ...state,
        userListData: [action.data]
      };
    }
    case 'changed_isModalOpen': {
      return {
        ...state,
        isModalOpen: action.data,
        moneyInput: 0,
      };
    }
    case 'changed_user': {
      return {
        ...state,
        user: action.data
      };
    }
    case 'def_user': {
      return {
        ...state,
        user: {
          userName: '',
          phoneNumber: 0,
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
  async function getUser(value) {
    try {
      var res = new UserClient()
      var json = await res.getUser(value)
      dispatch({ type: 'getOne_user', data: json })
    }
    catch (error) {
      message.error('未找到该号码')
      console.log(error)
    }
  }

  async function getUserList(pageNumber, pageSize) {
    try {
      var res = new UserClient()
      var json = await res.getUserList(pageNumber, pageSize)
      dispatch({ type: 'changed_userListData', data: json })
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
  async function createUser() {
    try {
      var res = new UserClient()
      await res.createUser(state.user)
      message.success('注册成功')
      dispatch({ type: 'def_user' })
      getUserList(state.pages.pageNumber, state.pages.pageSize)
    }
    catch (error) {
      message.error('注册失败')
      console.log(error)
    }
  }

  async function handleOk() {
    createUser()
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function handleCancel() {
    dispatch({ type: 'changed_user', data: initialState.user })
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function onChange(e, type) {
    dispatch({
      type: 'changed_user', data: {
        userName: type == 'userName' ? e.target.value : state.user.userName,
        phoneNumber: type == 'phoneNumber' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.user?.phoneNumber,
        money: type == 'money' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.user?.money,
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
    getUserList(page, pageSize)
  }
  useEffect(() => { getUserList(1, 10); }, [])
  return (
    <Layout props={{ menuKey: 'user' }}>
      <Card
        title={<Search placeholder="手机号码" style={{ width: '200px' }} onSearch={(value) => getUser(value)}></Search>}
        type='noBorder'
        extra={<Button onClick={() => dispatch({ type: 'changed_isModalOpen', data: true })}>注册用户</Button>}
      >
        <UserList props={{ data: state.userListData, pages: state.pages }} getUserList={getUserList} changedPage={(page, pageSize) => changedPage(page, pageSize)} />
      </Card>
      <Modal
        title="注册用户"
        open={state.isModalOpen}
        onOk={() => handleOk()}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消">
        <Row style={{ padding: '20px 50px 10px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>用户名：</span></Col>
          <Col span={19}><Input value={state.user.userName} onChange={(e) => onChange(e, 'userName')} /></Col>
        </Row>
        <Row style={{ padding: '20px 50px 10px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>手机号码：</span></Col>
          <Col span={19}><Input value={state.user.phoneNumber} onChange={(e) => onChange(e, 'phoneNumber')} /></Col>
        </Row>
        <Row style={{ padding: '10px 50px 20px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>初始金额：</span></Col>
          <Col span={19}><Input value={state.user.money} onChange={(e) => onChange(e, 'money')} /></Col>
        </Row>
      </Modal>
    </Layout>

  )
}
export default Index