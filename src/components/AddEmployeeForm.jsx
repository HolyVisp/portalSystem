import { Button, Card, Form, Input, Select } from 'antd';
import { useOrganization } from '../context/OrganizationContext.jsx';
import { collectDepartments } from '../utils/treeHelpers.js';

const roleOptions = [
  { label: 'Сотрудник', value: 'employee' },
  { label: 'Начальник отделения', value: 'unitHead' },
  { label: 'Начальник отдела', value: 'departmentHead' },
  { label: 'Руководитель направления', value: 'divisionHead' },
];

function AddEmployeeForm() {
  const [form] = Form.useForm();
  const { structure, addEmployee } = useOrganization();
  const departments = collectDepartments(structure);

  const handleFinish = (values) => {
    addEmployee(values.department, values.name, values.role);
    form.resetFields();
  };

  return (
    <Card title="Добавить сотрудника">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="ФИО"
          name="name"
          rules={[{ required: true, message: 'Введите ФИО сотрудника' }]}
        >
          <Input placeholder="Например, Светлана Фомина" />
        </Form.Item>
        <Form.Item
          label="Подразделение"
          name="department"
          rules={[{ required: true, message: 'Выберите подразделение' }]}
        >
          <Select
            placeholder="Выберите подразделение"
            options={departments.map((dept) => ({ value: dept.id, label: dept.title }))}
          />
        </Form.Item>
        <Form.Item
          label="Роль"
          name="role"
          rules={[{ required: true, message: 'Укажите роль сотрудника' }]}
        >
          <Select placeholder="Роль" options={roleOptions} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddEmployeeForm;
