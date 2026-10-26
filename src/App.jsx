import Button from "./components/Button";

export default function App() {
  return (
    <div className="flex gap-4 p-8">
      <Button>Masuk</Button>
      <Button variant="secondary">Batal</Button>
    </div>
  );
}
