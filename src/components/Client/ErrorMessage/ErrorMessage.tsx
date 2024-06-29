interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-container">
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  )
}