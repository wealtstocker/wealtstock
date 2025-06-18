export default function Login() {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-2xl mb-4">Login</h2>
        <input className="w-full border p-2 mb-4" type="text" placeholder="Username" />
        <input className="w-full border p-2 mb-4" type="password" placeholder="Password" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Login</button>
      </div>
    )
  }
  