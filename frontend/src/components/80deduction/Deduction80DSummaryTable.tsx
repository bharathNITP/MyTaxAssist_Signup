import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Deduction80DRecord } from "../../../../shared-types/deduction80D.types";
import { deduction80DStore } from "../../stores/deduction80DStore";

interface Deduction80DSummaryTableProps {
  records: Deduction80DRecord[];
  onEdit: (record: Deduction80DRecord) => void;
  onDelete: (record: Deduction80DRecord) => void;
}

export default function Deduction80DSummaryTable({ records, onEdit, onDelete }: Deduction80DSummaryTableProps) {
  const currentPage = deduction80DStore((s) => s.currentPage);
  const rowsPerPage = deduction80DStore((s) => s.rowsPerPage);
  const setCurrentPage = deduction80DStore((s) => s.setCurrentPage);
  const setRowsPerPage = deduction80DStore((s) => s.setRowsPerPage);
  const totalItems = records.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const paginatedRecords = records.slice(startIndex, endIndex);

  if (records.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-body text-textmuted">No 80D deductions added yet</Text>
      </View>
    );
  }

  const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

  return (
    <View>
      <View className="overflow-auto border border-border rounded-lg">
        <View className="flex-row bg-tableheader border-b border-border min-w-[900px]">
          <Text className="flex-[1.5] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">In Respect of</Text>
          <Text className="flex-[1] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Age group</Text>
          <Text className="flex-[1.5] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Type of Policy</Text>
          <Text className="flex-[1.2] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Premium Amount</Text>
          <Text className="flex-[1.5] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Kind of Payment</Text>
          <Text className="flex-[1.3] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Uploaded Files</Text>
          <Text className="flex-[1] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Note</Text>
          <Text className="flex-[0.8] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide text-center">Actions</Text>
        </View>
        {paginatedRecords.map((record, idx) => (
          <View
            key={record.__id__}
            className={
              idx % 2 === 0
                ? "flex-row items-center border-b border-border bg-tablerow/40 min-w-[900px]"
                : "flex-row items-center border-b border-border bg-surface min-w-[900px]"
            }
          >
            <Text className="flex-[1.5] px-3 py-2.5 text-body text-textprimary">{record.In_respect_of}</Text>
            <Text className="flex-[1] px-3 py-2.5 text-body text-textsecondary">{record.Age_Group}</Text>
            <Text className="flex-[1.5] px-3 py-2.5 text-body text-textsecondary">{record.type_of_policy}</Text>
            <Text className="flex-[1.2] px-3 py-2.5 text-body text-textsecondary">
              {record.Kind_of_payment === "Mediclaim premium"
                ? `Rs. ${record.Premium_Amount?.toLocaleString() || "0"}`
                : `Rs. ${record.Amount?.toLocaleString() || "0"}`}
            </Text>
            <Text className="flex-[1.5] px-3 py-2.5 text-body text-textsecondary">{record.Kind_of_payment}</Text>
            <Text className="flex-[1.3] px-3 py-2.5 text-body text-textsecondary">
              {record.Deduction_80D_Files_Name?.length > 0
                ? `${record.Deduction_80D_Files_Name.length} file(s)`
                : "-"}
            </Text>
            <Text className="flex-[1] px-3 py-2.5 text-body text-textsecondary">
              {record.Deduction_Note ? (record.Deduction_Note.length > 20 ? record.Deduction_Note.slice(0, 20) + "..." : record.Deduction_Note) : "-"}
            </Text>
            <View className="flex-[0.8] px-3 py-2.5 flex-row items-center justify-center gap-2">
              <TouchableOpacity onPress={() => onDelete(record)} className="p-1">
                <Text className="text-danger text-base">{String.fromCharCode(128465)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onEdit(record)} className="p-1">
                <Text className="text-textmuted text-base">{String.fromCharCode(9998)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-supporting text-textmuted">Rows per page:</Text>
          <TouchableOpacity
            className="border border-border rounded px-2 py-1 bg-surface"
            onPress={() => {
              const i = ROWS_PER_PAGE_OPTIONS.indexOf(rowsPerPage);
              setRowsPerPage(ROWS_PER_PAGE_OPTIONS[(i + 1) % ROWS_PER_PAGE_OPTIONS.length]);
            }}
          >
            <Text className="text-body text-textprimary">{rowsPerPage}</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-supporting text-textmuted">
          {totalItems > 0 ? `${startIndex + 1}\u2013${endIndex} of ${totalItems}` : "0 of 0"}
        </Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className={currentPage <= 1 ? "p-1.5 rounded border border-border opacity-40" : "p-1.5 rounded border border-border"}
            onPress={() => { if (currentPage > 1) setCurrentPage(currentPage - 1); }}
            disabled={currentPage <= 1}
          >
            <Text className="text-textmuted text-sm">{String.fromCharCode(60)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={currentPage >= totalPages ? "p-1.5 rounded border border-border opacity-40" : "p-1.5 rounded border border-border"}
            onPress={() => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
            disabled={currentPage >= totalPages}
          >
            <Text className="text-textmuted text-sm">{String.fromCharCode(62)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


