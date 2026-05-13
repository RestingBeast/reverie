"use client";

type Props = {
  onClick: () => void;
  loading: boolean;
  label?: string;
}

export default function GenerateButton({ onClick, loading, label }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed
                 text-black font-semibold px-6 py-3 rounded-full transition text-sm"
    >
      {loading ? "" : (label)}
    </button>
  )
}
