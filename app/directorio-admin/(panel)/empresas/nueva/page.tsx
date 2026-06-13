import EmpresaForm from "../EmpresaForm";

export default function NuevaEmpresaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Nueva empresa</h1>
        <p className="text-gray-400 text-sm mt-1">Completá los datos del comercio</p>
      </div>
      <EmpresaForm />
    </div>
  );
}
