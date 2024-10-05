import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/register')({
  component: Register,
})

function Register() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}
