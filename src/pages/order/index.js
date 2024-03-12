
import { useEffect, useReducer } from 'react';
import Layout from '../layout.js';
import { OrderGoodsClient } from 'api';
import { Card } from '@/tools/index.js';
import { Button, Input, message, Modal, Col, Row, } from 'antd';
import { OrderGoodsList } from '@/component'

const { Search } = Input


const initialState = {
  orderGoods: {
    orderGoodsName: '',
    phoneNumber: 0,
    money: 0
  },
  orderGoodsListData: [],
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
    case 'changed_orderGoodsListData': {
      action.data.items.map((vlaue, key) => {
        action.data.items[key]['key'] = action.data.items[key].id
      })
      return {
        ...state,
        orderGoodsListData: action.data.items
      };
    }
    case 'getOne_orderGoods': {
      action.data['key'] = 1
      return {
        ...state,
        orderGoodsListData: [action.data]
      };
    }
    case 'changed_isModalOpen': {
      return {
        ...state,
        isModalOpen: action.data,
        moneyInput: 0,
      };
    }
    case 'changed_orderGoods': {
      return {
        ...state,
        orderGoods: action.data
      };
    }
    case 'def_orderGoods': {
      return {
        ...state,
        orderGoods: {
          orderGoodsName: '',
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
  async function getOrderGoods(value) {
    try {
      var res = new OrderGoodsClient()
      var json = await res.getOrderGoods(value)
      dispatch({ type: 'getOne_orderGoods', data: json })
    }
    catch (error) {
      message.error('未找到该号码')
      console.log(error)
    }
  }

  async function getOrderGoodsList(pageNumber, pageSize) {
    try {
      var res = new OrderGoodsClient()
      var json = await res.getOrderGoodsList(pageNumber, pageSize)
      dispatch({ type: 'changed_orderGoodsListData', data: json })
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
  async function createOrderGoods() {
    try {
      var res = new OrderGoodsClient()
      await res.createOrderGoods(state.orderGoods)
      message.success('注册成功')
      dispatch({ type: 'def_orderGoods' })
      getOrderGoodsList(state.pages.pageNumber, state.pages.pageSize)
    }
    catch (error) {
      message.error('注册失败')
      console.log(error)
    }
  }

  async function handleOk() {
    createOrderGoods()
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function handleCancel() {
    dispatch({ type: 'changed_orderGoods', data: initialState.orderGoods })
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function onChange(e, type) {
    dispatch({
      type: 'changed_orderGoods', data: {
        orderGoodsName: type == 'orderGoodsName' ? e.target.value : state.orderGoods.orderGoodsName,
        phoneNumber: type == 'phoneNumber' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.orderGoods?.phoneNumber,
        money: type == 'money' ? Number(e.target.value) ? Number(e.target.value) : 0 : state.orderGoods?.money,
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
    getOrderGoodsList(page, pageSize)
  }
  useEffect(() => { getOrderGoodsList(1, 10); }, [])
  return (
    <Layout props={{ menuKey: 'order' }}>
      <Card
        title={<>
        <div style={{margin:'10px 0px 5px 0px'}}><Search placeholder="手机号码" style={{ width: '200px' }} onSearch={(value) => getOrderGoods(value)}></Search></div>
        <div style={{margin:'10px 0px 5px 0px'}}><Search placeholder="房间名称" style={{ width: '200px' }} onSearch={(value) => getOrderGoods(value)}></Search></div>
        </>}
        type='noBorder'
        extra={<Button onClick={() => dispatch({ type: 'changed_isModalOpen', data: true })}>新建订单</Button>}
      >
        {/* <OrderGoodsList props={{ data: state.orderGoodsListData, pages: state.pages }} getOrderGoodsList={getOrderGoodsList} changedPage={(page, pageSize) => changedPage(page, pageSize)} /> */}
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
          <Col span={19}><Input value={state.orderGoods.orderGoodsName} onChange={(e) => onChange(e, 'orderGoodsName')} /></Col>
        </Row>
        <Row style={{ padding: '20px 50px 10px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>手机号码：</span></Col>
          <Col span={19}><Input value={state.orderGoods.phoneNumber} onChange={(e) => onChange(e, 'phoneNumber')} /></Col>
        </Row>
        <Row style={{ padding: '10px 50px 20px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>初始金额：</span></Col>
          <Col span={19}><Input value={state.orderGoods.money} onChange={(e) => onChange(e, 'money')} /></Col>
        </Row>
      </Modal>
    </Layout>

  )
}
export default Index