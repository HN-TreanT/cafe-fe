import { UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  const menu = (
    <Menu style={{ width: '200px' }} /* Điều chỉnh chiều rộng của menu xổ xuống */>
      <Menu.Item key="1">
        <Link to="/option1">
          <span>
            <UserOutlined style={{ marginRight: '8px' }} />
            Thông tin
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/option2">
          <span>
            <DownOutlined style={{ marginRight: '8px' }} />
            Đổi mật khẩu
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/login">
          <span>
            <LogoutOutlined style={{ marginRight: '8px' }} />
            Đăng xuất
          </span>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ marginRight: '20px' }}>
        <h4 style={{ marginTop: '2px' }}>{userData?.data?.name} </h4>
      </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link" style={{marginRight: '10px'}} onClick={(e) => e.preventDefault()}>
          <UserOutlined style={{ fontSize: '35px', padding: '14px', marginRight: '-7px' }} />
          <DownOutlined /> 
        </a>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
