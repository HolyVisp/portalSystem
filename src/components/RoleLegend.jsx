import { Alert, Space, Tag, Typography } from 'antd';

const roles = [
  {
    key: 'employee',
    title: 'Сотрудник',
    description: 'видит только свое подразделение',
    color: 'blue',
  },
  {
    key: 'unitHead',
    title: 'Начальник отделения',
    description: 'видит структуру своего отделения',
    color: 'green',
  },
  {
    key: 'departmentHead',
    title: 'Начальник отдела',
    description: 'видит свой отдел и соседние подразделения',
    color: 'orange',
  },
  {
    key: 'divisionHead',
    title: 'Руководитель направления',
    description: 'видит смежные отделы и уровни выше',
    color: 'red',
  },
];

function RoleLegend() {
  return (
    <Alert
      showIcon
      type="info"
      style={{ marginBottom: 24 }}
      message="Ролевые правила доступа"
      description={
        <Space direction="vertical" style={{ width: '100%' }}>
          {roles.map((role) => (
            <Space key={role.key}>
              <Tag color={role.color}>{role.title}</Tag>
              <Typography.Text type="secondary">{role.description}</Typography.Text>
            </Space>
          ))}
          <Typography.Text type="secondary">
            Администратор имеет полный доступ к дереву предприятия.
          </Typography.Text>
        </Space>
      }
    />
  );
}

export default RoleLegend;
