
import { useEffect, useReducer } from 'react';
import Layout from '../layout.js';
import { UserClient, Users } from 'api';

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
      <Layout props={{menuKey:'room'}}>
        <div>
          房间
        </div>
      </Layout>
        
    )
}
export default Index