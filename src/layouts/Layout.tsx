import React, {  useContext, useEffect } from 'react'
import { Layout, theme } from 'antd';
import Sidebar from './sider/sider';
import { Navigate, Outlet } from 'react-router-dom';
import './Layout.scss'
import { RouterLinks } from '../const/RouterLinks';
import { AppContext } from '../context/appContext';
const { Header, Content } = Layout;

const App: React.FC = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")
  const {socket} = useContext(AppContext)
  
  useEffect(() => {
    // socket.io.opts.query = { username: me?.username };
    socket.disconnect();
    socket.connect();
  }, [socket])

  if (!token) {
    return <Navigate to={"/login"} />;
  }
  
  if(role === "U") {
    return <Navigate to={RouterLinks.ORDER_PAGE}/>
  }

  if(role === "M") {
    return <Navigate to={RouterLinks.CHEF_PAGE}/>
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
