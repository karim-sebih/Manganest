export default function handleLogout() {
  localStorage.removeItem("first_name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  window.location.href = "/";
}