"use client";

import { Wallet, Trash2, Plus } from "lucide-react";
import type { IncomeItem } from "../types";
import { formatAmountInput, createEmptyIncomeItem } from "../lib/tax";
import { ToggleSwitch } from "./ToggleSwitch";

interface IncomeListSectionProps {
  title: string;
  items: IncomeItem[];
  setItems: React.Dispatch<React.SetStateAction<IncomeItem[]>>;
  addLabel: string;
}

export function IncomeListSection({
  title,
  items,
  setItems,
  addLabel,
}: IncomeListSectionProps) {
  const handleNameChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item)),
    );
  };

  const handleAmountChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: formatAmountInput(value) } : item,
      ),
    );
  };

  const handleWithholdingChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, withholding: formatAmountInput(value) }
          : item,
      ),
    );
  };

  const handleToggle = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: checked } : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    setItems((prev) => [...prev, createEmptyIncomeItem()]);
  };

  return (
    <div id="income-section" className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Wallet className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="items-list space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${!item.enabled ? "item-disabled" : ""}`}
          >
            <div className="item-row">
              <ToggleSwitch
                checked={item.enabled}
                onChange={(checked) => handleToggle(item.id, checked)}
                ariaLabel={`เปิด/ปิดรายการ ${item.name || "เงินได้"}`}
              />
              <input
                type="text"
                className="input-name"
                placeholder="รายการเงินได้"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
              />
              <input
                type="text"
                inputMode="decimal"
                className="input-amount"
                placeholder="จำนวนเงิน"
                value={item.amount}
                onChange={(e) => handleAmountChange(item.id, e.target.value)}
              />
              <input
                type="text"
                inputMode="decimal"
                className="input-amount"
                placeholder="หัก ณ ที่จ่าย"
                value={item.withholding}
                onChange={(e) =>
                  handleWithholdingChange(item.id, e.target.value)
                }
              />
              <button
                className="btn-remove"
                onClick={() => handleRemove(item.id)}
                aria-label="ลบรายการ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={handleAdd}>
          <Plus className="w-5 h-5 mr-1" /> {addLabel}
        </button>
      </div>
    </div>
  );
}
