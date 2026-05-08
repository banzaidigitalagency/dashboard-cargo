type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next = "/", error } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold tracking-tight">Cargo</div>
          <p className="text-sm text-neutral-500 mt-1">Dashboard client</p>
        </div>
        <form action="/api/login" method="post" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Mot de passe</span>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </label>
          {error && <p className="text-sm text-red-600">Mot de passe incorrect.</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
