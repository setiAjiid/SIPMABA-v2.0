import Button from "./components/Button";
import Input from "./components/Input";

export default function App() {
  return (
    <div className="flex w-80 flex-col gap-4 p-8">
      <Input label="Nama pengguna" placeholder="Masukkan nama pengguna" />
      <Input
        label="NISN"
        placeholder="0000000000"
        hint="10 digit"
        maxLength={10}
        inputMode="numeric"
      />{" "}
      <Input label="NIK" defaultValue="123" error="NIK harus 16 digit" />
      <Button className="w-full">Masuk</Button>
    </div>
  );
}
