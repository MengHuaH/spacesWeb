import React from 'react';
import { menu } from '@/tools';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router'

const { Content, Sider } = Layout;

const App = ({children,props}) => {
    const router = useRouter()
    return (
        <Layout hasSider>
            <Sider
                style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['/'+props?.menuKey]} items={menu} onClick={(res) => router.push(res.key)}/>
            </Sider>
            <Layout
                style={{
                marginLeft: 200,
                }}
            >
                <Content
                style={{
                    margin: '24px 16px',
                    overflow: 'initial',
                }}
                >
                {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;