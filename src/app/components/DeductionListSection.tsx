"use client";

import { PiggyBank, Trash2 } from "lucide-react";
import type { DeductionItem } from "../types";
import { formatAmountInput, createEmptyDeductionItem } from "../lib/tax";
import { ToggleSwitch } from "./ToggleSwitch";

interface DeductionListSectionProps {
  title: string;
  items: DeductionItem[];
  setItems: React.Dispatch<React.SetStateAction<DeductionItem[]>>;
  addLabel: string;
}

export function DeductionListSection({
  title,
  items,
  setItems,
  addLabel,
}: DeductionListSectionProps) {
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
    setItems((prev) => [...prev, createEmptyDeductionItem()]);
  };

  return (
    <div id="deduction-section" className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <PiggyBank className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="items-list space-y-4">
        {/* Column Headers */}
        <div className="item-row item-header" aria-hidden="true">
          <div className="toggle-switch-placeholder" />
          <span className="input-name item-header-label">รายการ</span>
          <span className="input-amount item-header-label">จำนวนเงิน</span>
          <span className="btn-remove-placeholder" />
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${!item.enabled ? "item-disabled" : ""}`}
          >
            <div className="item-row">
              <ToggleSwitch
                checked={item.enabled}
                onChange={(checked) => handleToggle(item.id, checked)}
                ariaLabel={`เปิด/ปิดรายการ ${item.name || "ค่าลดหย่อน"}`}
              />
              <input
                type="text"
                className="input-name"
                placeholder="รายการลดหย่อน"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
              />
              <input
                type="text"
                inputMode="decimal"
                className="input-amount"
                placeholder="0"
                value={item.amount}
                onChange={(e) => handleAmountChange(item.id, e.target.value)}
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
          <span className="icon-plus">+</span> {addLabel}
        </button>
      </div>
    </div>
  );
}
