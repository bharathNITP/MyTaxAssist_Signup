import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BankRecord } from "../../../../shared-types/bank.types";
import { bankStore } from "../../stores/bankStore";

interface BankDetailsSummaryTableProps {
  records: BankRecord[];
  onEdit: (record: BankRecord) => void;
  onDelete: (record: BankRecord) => void;
  onInfo: (record: BankRecord) => void;
}

function maskAccountNumber(accNo: string): string {
  if (accNo.length <= 4) return accNo;
  return "*".repeat(accNo.length - 4) + accNo.slice(-4);
}

export default function BankDetailsSummaryTable({ records, onEdit, onDelete, onInfo }: BankDetailsSummaryTableProps) {
  const currentPage = bankStore((s) => s.currentPage);
  const rowsPerPage = bankStore((s) => s.rowsPerPage);
  const setCurrentPage = bankStore((s) => s.setCurrentPage);
  const setRowsPerPage = bankStore((s) => s.setRowsPerPage);
  const totalItems = records.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const paginatedRecords = records.slice(startIndex, endIndex);
  if (records.length === 0) {
    return (<View className="py-8 items-center"><Text className="text-body text-textmuted">No bank accounts added yet</Text></View>);
  }
  return (
    <View>
      <View className="overflow-auto border border-border rounded-lg">
        <View className="flex-row bg-tableheader border-b border-border">
          <Text className="flex-[2] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Bank Name</Text>
          <Text className="flex-[2] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Account Number</Text>
          <Text className="flex-[1.5] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">IFSC Code</Text>
          <Text className="flex-[1.5] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Account Type</Text>
          <Text className="flex-[1.5] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide">Primary/Secondary</Text>
          <Text className="flex-[1] px-3 py-2.5 text-micro text-textmuted uppercase tracking-wide text-center">Actions</Text>
        </View>
        {paginatedRecords.map((record, idx) => (
          <View key={record.Bank_ID} className={idx % 2 === 0 ? "flex-row items-center border-b border-border bg-tablerow/40" : "flex-row items-center border-b border-border bg-surface"}>
            <Text className="flex-[2] px-3 py-2.5 text-body text-textprimary font-bold">{record.Bank_Name}</Text>
            <Text className="flex-[2] px-3 py-2.5 text-body text-textsecondary">{maskAccountNumber(record.Account_Number)}</Text>
            <Text className="flex-[1.5] px-3 py-2.5 text-body text-textsecondary">{record.IFSC_Code}</Text>
            <Text className="flex-[1.5] px-3 py-2.5 text-body text-textsecondary">{record.Account_Type}</Text>
            <Text className="flex-[1.5] px-3 py-2.5 text-body text-info font-bold">{record.Primary_Account}</Text>
            <View className="flex-[1] px-3 py-2.5 flex-row items-center justify-center gap-2">
              <TouchableOpacity onPress={() => onDelete(record)} className="p-1"><Text className="text-danger text-base">{String.fromCharCode(128465)}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onEdit(record)} className="p-1"><Text className="text-textmuted text-base">{String.fromCharCode(9999)}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onInfo(record)} className="p-1"><Text className="text-info text-base">{String.fromCharCode(8505)}</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-supporting text-textmuted">Rows per page:</Text>
          <TouchableOpacity className="border border-border rounded px-2 py-1 bg-surface" onPress={() => { const opts = [5,10,20,50]; const i = opts.indexOf(rowsPerPage); setRowsPerPage(opts[(i+1)%opts.length]); }}>
            <Text className="text-body text-textprimary">{rowsPerPage}</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-supporting text-textmuted">{startIndex+1}-{endIndex} of {totalItems}</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className={currentPage <= 1 ? "p-1.5 rounded border border-border opacity-40" : "p-1.5 rounded border border-border"} onPress={() => { if (currentPage > 1) setCurrentPage(currentPage-1); }} disabled={currentPage <= 1}>
            <Text className="text-textmuted text-sm">{String.fromCharCode(60)}</Text>
          </TouchableOpacity>
          <TouchableOpacity className={currentPage >= totalPages ? "p-1.5 rounded border border-border opacity-40" : "p-1.5 rounded border border-border"} onPress={() => { if (currentPage < totalPages) setCurrentPage(currentPage+1); }} disabled={currentPage >= totalPages}>
            <Text className="text-textmuted text-sm">{String.fromCharCode(62)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}