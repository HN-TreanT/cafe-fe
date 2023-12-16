import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  const menu = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ marginRight: '20px' }}>
        <h4 style={{ marginTop: '2px' }}>{userData?.data?.name}</h4>
      </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <UserOutlined style={{ fontSize: '35px', padding: '14px' }} />
        </a>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
