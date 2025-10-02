import { Button, Card, Form, Input, Select } from 'antd';
import { useOrganization } from '../context/OrganizationContext.jsx';
import { collectDepartments } from '../utils/treeHelpers.js';

function AddDepartmentForm() {
  const [form] = Form.useForm();
  const { structure, addDepartment } = useOrganization();
  const departments = collectDepartments(structure);

  const handleFinish = (values) => {
    addDepartment(values.parent || null, values.name);
    form.resetFields();
  };

  return (
    <Card title="Добавить подразделение">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: 'Введите название подразделения' }]}
        >
          <Input placeholder="Например, Служба поддержки" />
        </Form.Item>
        <Form.Item label="Родительское подразделение" name="parent">
          <Select
            allowClear
            placeholder="Верхний уровень"
            options={departments.map((dept) => ({ value: dept.id, label: dept.title }))}
          />
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

export default AddDepartmentForm;
