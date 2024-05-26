
import { useEffect, useReducer } from 'react';
import Layout from '../layout.js';
import { OrderGoodsClient } from 'api';
import { Card } from '@/tools/index.js';
import { Input, message } from 'antd';
import { OrderList } from '@/component'

const { Search } = Input


const initialState = {
  orderGoodsListData: [],
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
      var json = await res.getOrderGoodsWithPagination(value, 0, state.pages.pageNumber, state.pages.pageSize)
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
      message.error('未找到该订单')
      console.log(error)
    }
  }

  async function getOrderGoodsList(pageNumber, pageSize) {
    try {
      var res = new OrderGoodsClient()
      var json = await res.getOrderGoodsWithPagination('',0, pageNumber, pageSize)
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
          <div style={{ margin: '10px 0px 5px 0px' }}><Search placeholder="订单号" style={{ width: '400px' }} onSearch={(value) => getOrderGoods(value)}></Search></div>
        </>}
        type='noBorder'
      >
        <OrderList props={{ data: state.orderGoodsListData, pages: state.pages }} changedPage={(page, pageSize) => changedPage(page, pageSize)} />
      </Card>
    </Layout>

  )
}
export default Index