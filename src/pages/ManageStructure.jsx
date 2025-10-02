import { Col, Row, Space, Typography } from 'antd';
import AddDepartmentForm from '../components/AddDepartmentForm.jsx';
import AddEmployeeForm from '../components/AddEmployeeForm.jsx';
import OrganizationTree from '../components/OrganizationTree.jsx';
import { useOrganization } from '../context/OrganizationContext.jsx';

function ManageStructure() {
  const { structure } = useOrganization();

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Typography.Title level={4}>
        Управление структурой предприятия
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <AddDepartmentForm />
            <AddEmployeeForm />
          </Space>
        </Col>
        <Col xs={24} lg={14}>
          <OrganizationTree data={structure} />
        </Col>
      </Row>
    </Space>
  );
}

export default ManageStructure;
