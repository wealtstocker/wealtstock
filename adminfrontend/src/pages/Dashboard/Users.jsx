import { Table } from 'antd'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
]

const data = [
  { key: '1', name: 'John Doe', email: 'john@example.com' },
  { key: '2', name: 'Jane Smith', email: 'jane@example.com' },
]

export default function Users() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
