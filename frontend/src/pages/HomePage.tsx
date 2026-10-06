import { Link } from 'react-router-dom'

const cards = [
  { to: '/designations', title: 'Designation', desc: 'Add new designations and view the list.' },
  { to: '/employees', title: 'View/Add Employee', desc: 'Manage employees: add, edit, delete.' },
]

export default function HomePage() {
  return (
    <div className="py-10">
      <h1 className="text-center text-3xl font-bold">Employee Management</h1>
      <p className="mt-2 text-center text-slate-500">Choose a section to continue</p>
      <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="card transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-indigo-600">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}