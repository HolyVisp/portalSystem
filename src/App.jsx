import { Layout, Menu, Typography } from 'antd';
import {
  ApartmentOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { OrganizationProvider } from './context/OrganizationContext.jsx';
import ManageStructure from './pages/ManageStructure.jsx';
import StructureView from './pages/StructureView.jsx';
import RoleLegend from './components/RoleLegend.jsx';

const { Header, Sider, Content, Footer } = Layout;

const menuItems = [
  {
    key: '/manage',
    icon: <ClusterOutlined />,
    label: <Link to="/manage">Управление структурой</Link>,
  },
  {
    key: '/structure',
    icon: <ApartmentOutlined />,
    label: <Link to="/structure">Дерево подразделений</Link>,
  },
];

function App() {
  const location = useLocation();

  return (
    <OrganizationProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
              Portal
            </Typography.Title>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
          />
        </Sider>
        <Layout>
          <Header style={{ background: 'white', paddingInline: 24 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Система управления персоналом
            </Typography.Title>
          </Header>
          <Content style={{ margin: 24 }}>
            <RoleLegend />
            <Routes>
              <Route path="/" element={<ManageStructure />} />
              <Route path="/manage" element={<ManageStructure />} />
              <Route path="/structure" element={<StructureView />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design React Portal · 2024
          </Footer>
        </Layout>
      </Layout>
    </OrganizationProvider>
  );
}

export default App;
