function ErrorMessage({ message, className = "Error" }) {
  return <p className={className}>{message}</p>;
}
export default ErrorMessage;
