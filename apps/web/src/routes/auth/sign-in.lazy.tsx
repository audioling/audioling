import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/sign-in')({
  component: About,
})

function About() {
  return <div className="p-2">Hello from About!</div>
}
