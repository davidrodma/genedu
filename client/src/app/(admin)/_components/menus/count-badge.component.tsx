export const CountBadge = ({ count }: { count: number }) => (
  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success-300">
    <span className="text-[10px] font-semibold text-white">{count}</span>
  </div>
)
