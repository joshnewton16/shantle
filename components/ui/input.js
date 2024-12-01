const Input = ({ className, ...props }) => (
  <input className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ${className}`} {...props} />
)

export { Input }
