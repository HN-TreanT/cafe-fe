import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import Sidebar from './sider/sider';
import { Navigate, Outlet } from 'react-router-dom';
import './Layout.scss'

const { Header, Content } = Layout;

const App: React.FC = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Layout >
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 300 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0', overflow: 'initial',
          }}
        >
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
