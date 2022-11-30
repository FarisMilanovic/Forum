import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="md:mx-w-2x1 md-mx-auto">
      <Nav />
      <main>{children}</main>
    </div>
  );
}
