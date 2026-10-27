import { useCallback, useEffect, useState } from "react";
import { ambilStatusBiodata } from "./biodata";

// null selama memuat; muatUlang dipanggil setelah sebuah tab disimpan.
export function useStatusBiodata() {
  const [hasil, setHasil] = useState(null);
  const [putaran, setPutaran] = useState(0);

  useEffect(() => {
    let batal = false;
    ambilStatusBiodata()
      .then((h) => {
        if (!batal) setHasil(h);
      })
      .catch(() => {
        if (!batal) setHasil({ status: {}, noPendaftaran: "" });
      });
    return () => {
      batal = true;
    };
  }, [putaran]);

  const muatUlang = useCallback(() => setPutaran((p) => p + 1), []);
  return [hasil, muatUlang];
}
