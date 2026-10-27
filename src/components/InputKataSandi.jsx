import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

export default function InputKataSandi(props) {
  const [tampil, setTampil] = useState(false);

  return (
    <Input
      {...props}
      type={tampil ? "text" : "password"}
      akhir={
        <button
          type="button"
          onClick={() => setTampil((t) => !t)}
          aria-label={
            tampil ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          }
          className="text-muted hover:text-ink"
        >
          {tampil ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
