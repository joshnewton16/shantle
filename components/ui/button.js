const Button = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  }
  return (
    <button className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${variants[variant]} ${className}`} {...props} />
  )
}

export { Button }
