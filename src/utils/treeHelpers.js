export function createTreeNode({ id, title, type, role = 'employee', children = [] }) {
  return {
    id,
    key: id,
    title,
    type,
    role,
    children: children.map((child) => ({ ...child })),
  };
}

export function cloneTree(tree) {
  return tree.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : [],
  }));
}

export function findNodePath(tree, nodeId, path = []) {
  for (const node of tree) {
    const newPath = [...path, node];
    if (node.id === nodeId) {
      return newPath;
    }
    if (node.children?.length) {
      const result = findNodePath(node.children, nodeId, newPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function collectDepartments(tree, accumulator = []) {
  for (const node of tree) {
    if (node.type === 'department') {
      accumulator.push({ id: node.id, title: node.title });
      collectDepartments(node.children ?? [], accumulator);
    }
  }
  return accumulator;
}

export function collectEmployees(tree, accumulator = []) {
  for (const node of tree) {
    if (node.type === 'employee') {
      accumulator.push(node);
    }
    if (node.children?.length) {
      collectEmployees(node.children, accumulator);
    }
  }
  return accumulator;
}

export function toAntdTreeData(tree) {
  return tree.map((node) => ({
    key: node.id,
    title: node.title,
    children: node.children ? toAntdTreeData(node.children) : [],
  }));
}
