import { Tree, Typography } from 'antd';
import { UserOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

const roleColors = {
  employee: 'rgba(22, 119, 255, 0.2)',
  unitHead: 'rgba(82, 196, 26, 0.2)',
  departmentHead: 'rgba(250, 173, 20, 0.2)',
  divisionHead: 'rgba(240, 71, 71, 0.2)',
};

function decorateTree(tree) {
  return tree.map((node) => {
    if (node.type === 'department') {
      return {
        key: node.id,
        icon: <ApartmentOutlined />,
        title: (
          <Typography.Text strong>
            {node.title}
          </Typography.Text>
        ),
        children: decorateTree(node.children ?? []),
      };
    }

    return {
      key: node.id,
      icon: <UserOutlined />,
      title: (
        <span
          style={{
            background: roleColors[node.role] ?? 'transparent',
            paddingInline: 8,
            borderRadius: 8,
          }}
        >
          {node.title}
          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
            {roleLabel(node.role)}
          </Typography.Text>
        </span>
      ),
      isLeaf: true,
    };
  });
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

function OrganizationTree({ data }) {
  const treeData = useMemo(() => decorateTree(data), [data]);

  return (
    <Tree
      showLine
      blockNode
      defaultExpandAll
      treeData={treeData}
      style={{ background: 'white', padding: 16, borderRadius: 12 }}
    />
  );
}

export default OrganizationTree;
