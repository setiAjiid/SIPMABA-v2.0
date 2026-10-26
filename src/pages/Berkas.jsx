import FileDropzone from "../components/FileDropzone";

export default function Berkas() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <FileDropzone
        label="Foto KIP-K / SKTM"
        hint="JPG/PNG, 200 sampai 500 KB"
        optional
      />
      <FileDropzone
        label="Rapor semester 1 sampai 7"
        hint="JPG/PNG, 200 sampai 500 KB"
      />
    </div>
  );
}
