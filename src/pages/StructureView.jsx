import { useMemo, useState } from 'react';
import { Alert, Card, Col, Descriptions, Empty, Row, Select, Space, Typography } from 'antd';
import OrganizationTree from '../components/OrganizationTree.jsx';
import { useOrganization } from '../context/OrganizationContext.jsx';
import { cloneTree, collectEmployees, findNodePath } from '../utils/treeHelpers.js';

const roleVisibilityLevels = {
  employee: 0,
  unitHead: 0,
  departmentHead: 1,
  divisionHead: 2,
};

function StructureView() {
  const { structure } = useOrganization();
  const employees = collectEmployees(structure);
  const [selectedViewer, setSelectedViewer] = useState({ type: 'admin' });

  const visibleTree = useMemo(
    () => filterStructureForViewer(structure, selectedViewer),
    [structure, selectedViewer],
  );

  const currentEmployee =
    selectedViewer.type === 'employee'
      ? employees.find((employee) => employee.id === selectedViewer.employeeId)
      : null;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Typography.Title level={4}>Дерево подразделений</Typography.Title>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>Выберите, от чьего имени просматривается структура:</Typography.Text>
          <Select
            size="large"
            value={selectedViewer.type === 'admin' ? 'admin' : selectedViewer.employeeId}
            onChange={(value) => {
              if (value === 'admin') {
                setSelectedViewer({ type: 'admin' });
              } else {
                setSelectedViewer({ type: 'employee', employeeId: value });
              }
            }}
            options={[{ label: 'Администратор', value: 'admin' }].concat(
              employees.map((employee) => ({
                label: `${employee.title} (${roleLabel(employee.role)})`,
                value: employee.id,
              })),
            )}
          />
          {currentEmployee ? (
            <ViewerInfo employee={currentEmployee} />
          ) : (
            <Alert
              type="success"
              showIcon
              message="Администратор"
              description="Отображается полная структура компании"
            />
          )}
        </Space>
      </Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          {visibleTree.length ? (
            <OrganizationTree data={visibleTree} />
          ) : (
            <Empty description="Нет данных для отображения" />
          )}
        </Col>
      </Row>
    </Space>
  );
}

function ViewerInfo({ employee }) {
  return (
    <Card type="inner" title={employee.title}>
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Роль">
          {roleLabel(employee.role)}
        </Descriptions.Item>
        <Descriptions.Item label="Права доступа">
          {accessDescription(employee.role)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

function filterStructureForViewer(structure, viewer) {
  if (!Array.isArray(structure) || !structure.length) {
    return [];
  }
  if (!viewer || viewer.type === 'admin') {
    return cloneTree(structure);
  }

  const path = findNodePath(structure, viewer.employeeId);
  if (!path) {
    return [];
  }

  const employeeNode = path[path.length - 1];
  const departmentPath = path.filter((node) => node.type === 'department');

  if (!departmentPath.length) {
    return cloneTree(structure);
  }

  const upLevels = roleVisibilityLevels[employeeNode.role] ?? 0;
  const scopeIndex = departmentPath.length - 1 - upLevels;

  if (scopeIndex < 0) {
    return cloneTree(structure);
  }

  const targetDepartment = departmentPath[scopeIndex];
  const clonedTree = cloneTree(structure);
  const targetPath = findNodePath(clonedTree, targetDepartment.id);
  if (!targetPath) {
    return [];
  }

  const targetNode = targetPath[targetPath.length - 1];
  return [targetNode];
}

function roleLabel(role) {
  switch (role) {
    case 'unitHead':
      return 'Начальник отделения';
    case 'departmentHead':
      return 'Начальник отдела';
    case 'divisionHead':
      return 'Руководитель направления';
    default:
      return 'Сотрудник';
  }
}

function accessDescription(role) {
  switch (role) {
    case 'unitHead':
      return 'Видит только отделение, которым управляет';
    case 'departmentHead':
      return 'Видит свой отдел и соседние подразделения внутри родительского отдела';
    case 'divisionHead':
      return 'Видит несколько уровней структуры, включая соседние отделы и родительские подразделения';
    default:
      return 'Видит только свое подразделение';
  }
}

export default StructureView;
