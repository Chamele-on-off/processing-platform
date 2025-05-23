import React from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  TransactionOutlined,
  SettingOutlined,
  FileTextOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

export const Icons = {
  Dashboard: DashboardOutlined,
  User: UserOutlined,
  Wallet: WalletOutlined,
  Transaction: TransactionOutlined,
  Settings: SettingOutlined,
  File: FileTextOutlined,
  Bell: BellOutlined,
  Logout: LogoutOutlined,
  MenuFold: MenuFoldOutlined,
  MenuUnfold: MenuUnfoldOutlined,
  Plus: PlusOutlined,
  Edit: EditOutlined,
  Delete: DeleteOutlined,
  Search: SearchOutlined,
  Filter: FilterOutlined,
  ArrowUp: ArrowUpOutlined,
  ArrowDown: ArrowDownOutlined,
  Success: CheckCircleOutlined,
  Error: CloseCircleOutlined,
  Warning: ExclamationCircleOutlined,
  Loading: LoadingOutlined
};

export const Icon = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};
