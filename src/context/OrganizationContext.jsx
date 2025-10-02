import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { cloneTree, createTreeNode, findNodePath } from '../utils/treeHelpers.js';

const OrganizationContext = createContext(null);

const initialStructure = [
  createTreeNode({
    id: 'dept-1',
    title: 'Головной офис',
    type: 'department',
    children: [
      createTreeNode({
        id: 'dept-1-1',
        title: 'Отдел продаж',
        type: 'department',
        children: [
          createTreeNode({
            id: 'emp-1',
            title: 'Анна Смирнова',
            type: 'employee',
            role: 'departmentHead',
          }),
          createTreeNode({
            id: 'emp-2',
            title: 'Иван Петров',
            type: 'employee',
            role: 'employee',
          }),
        ],
      }),
      createTreeNode({
        id: 'dept-1-2',
        title: 'Отдел разработки',
        type: 'department',
        children: [
          createTreeNode({
            id: 'emp-3',
            title: 'Мария Иванова',
            type: 'employee',
            role: 'unitHead',
          }),
          createTreeNode({
            id: 'emp-4',
            title: 'Алексей Сидоров',
            type: 'employee',
            role: 'employee',
          }),
        ],
      }),
    ],
  }),
  createTreeNode({
    id: 'dept-2',
    title: 'Региональное представительство',
    type: 'department',
    children: [
      createTreeNode({
        id: 'emp-5',
        title: 'Екатерина Кузнецова',
        type: 'employee',
        role: 'divisionHead',
      }),
      createTreeNode({
        id: 'emp-6',
        title: 'Николай Лебедев',
        type: 'employee',
        role: 'employee',
      }),
    ],
  }),
];

function OrganizationProvider({ children }) {
  const [structure, setStructure] = useState(initialStructure);
  const counterRef = useRef(10);

  const nextId = (prefix) => {
    counterRef.current += 1;
    return `${prefix}-${counterRef.current}`;
  };

  const addDepartment = (parentId, name) => {
    setStructure((prev) => {
      const newTree = cloneTree(prev);
      const newId = nextId('dept');
      const node = createTreeNode({
        id: newId,
        title: name,
        type: 'department',
        children: [],
      });

      if (!parentId) {
        newTree.push(node);
      } else {
        const path = findNodePath(newTree, parentId);
        if (!path) {
          message.error('Не удалось найти выбранное подразделение');
          return prev;
        }
        const parent = path[path.length - 1];
        parent.children.push(node);
      }

      message.success('Подразделение добавлено');
      return newTree;
    });
  };

  const addEmployee = (departmentId, name, role) => {
    setStructure((prev) => {
      const newTree = cloneTree(prev);
      const path = findNodePath(newTree, departmentId);
      if (!path) {
        message.error('Не удалось найти подразделение для сотрудника');
        return prev;
      }
      const parent = path[path.length - 1];
      const newId = nextId('emp');
      parent.children.push(
        createTreeNode({
          id: newId,
          title: name,
          type: 'employee',
          role,
          children: [],
        }),
      );
      message.success('Сотрудник добавлен');
      return newTree;
    });
  };

  const updateEmployeeRole = (employeeId, role) => {
    setStructure((prev) => {
      const newTree = cloneTree(prev);
      const path = findNodePath(newTree, employeeId);
      if (!path) {
        message.error('Сотрудник не найден');
        return prev;
      }
      const employeeNode = path[path.length - 1];
      employeeNode.role = role;
      message.success('Роль обновлена');
      return newTree;
    });
  };

  const value = useMemo(
    () => ({
      structure,
      addDepartment,
      addEmployee,
      updateEmployeeRole,
    }),
    [structure],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error('useOrganization должен использоваться внутри OrganizationProvider');
  }
  return ctx;
};

export { OrganizationProvider };
