
import { useEffect, useReducer } from 'react';
import { UserClient, Users } from '../../../web-api-client';
import { Button } from 'antd';

const initialArg = {
    user: Users,
    a:0
}

function reducer(state, action) {
    switch (action.type) {
        case 'changed_user': {
          return {
            ...state,
            user: action.user
          };
        }
        case 'changed_a': {
          return {
            ...state,
            a:state.a+1
          };
        }
    }
}
const Index = () => {
    const [state,dispatch] = useReducer(reducer, initialArg)

    async function get(){
        var res = new UserClient()
        var json = await res.getUser(15676211559)
        dispatch({type:'changed_user',user:json})
    }
    return (
      <>
        <div>
          <Button onClick={() => get()}>获取电话号码</Button>
          {state.user?.phoneNumber}
        </div>
        <div>
          <Button onClick={() => {dispatch({type:'changed_a'})}}>步进器</Button>
          {state.a}
        </div>
      </>
        
    )
}
export default Index