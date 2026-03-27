function Navbar() {

  const username = localStorage.getItem("username");

  return (
    <div style={styles.navbar}>
      <h3>Dashboard</h3>

      <div>
        Welcome, {username}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: "60px",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px"
  }
};

export default Navbar;