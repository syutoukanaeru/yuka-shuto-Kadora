import React from "react";

interface CustomButtonProps {
  label: string;
  variant?: "primary" | "danger";
}

export function CustomButton({
  label,
  variant = "primary",
}: CustomButtonProps) {
  const colorClass =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-orange-500 hover:bg-orange-600";

  return (
    <button
      className={`px-4 py-2 text-white font-bold rounded-xl transition ${colorClass}`}
    >
      {label}
    </button>
  );
}

export function Demo() {
  return (
    <div className="flex gap-2 p-4">
      <CustomButton label="保存する" variant="primary" />
      <CustomButton label="削除する" variant="danger" />
    </div>
  );
}
