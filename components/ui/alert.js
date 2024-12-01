const Alert = ({ className, ...props }) => (
  <div className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${className}`} {...props} />
)

const AlertTitle = ({ className, ...props }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props} />
)

const AlertDescription = ({ className, ...props }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
)

export { Alert, AlertTitle, AlertDescription }
