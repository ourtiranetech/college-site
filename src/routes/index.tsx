import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
     <h1 className='m-auto w-1/4 bg-red-600 border text-center '>SITE EN COURS DE CONSTRUCTION</h1>
    </main>
  )
}
