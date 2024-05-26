import React, { useReducer } from 'react';
import { Table, Tag  } from 'antd';
import { Room } from 'api';

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
  }
}

const OrderList = ({ props, changedPage }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '用户手机',
      dataIndex: ['user', 'phoneNumber'],
      key: 'phoneNumber',
    },
    {
      title: '房间名',
      dataIndex: ['room', 'name'],
      key: 'name',
    },
    {
      title: '起始时间',
      dataIndex: 'startingTime',
      key: 'startingTime',
      render: (res) => {
        return res.toLocaleString()
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (res) => {
        return res.toLocaleString()
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (res) => {
        return res.toLocaleString()
      }
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text, record) => {
        if(record.endTime < new Date() && (text == 1 || text == 2)){
          return <Tag color="default">已过期</Tag>
        }
        switch (text) {
          case 0:
            return <Tag color="error">已结束</Tag>;
          case 1:
            return <Tag color="success">已开始</Tag>;
          case 2:
            return <Tag color="warning">未开始</Tag>;
          case 3:
            return <Tag color="default">已取消</Tag>;
        }
      }
    },
  ];

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
    </>
  )
}
export default OrderList;