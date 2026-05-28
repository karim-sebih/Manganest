export default function handleLogout() {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  window.location.href = "/";
}