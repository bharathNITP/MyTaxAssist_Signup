import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Deduction80DRecord, Deduction80DFormData } from "../../../../../shared-types/deduction80D.types";
import { deduction80DStore } from "../../../stores/deduction80DStore";
import {
  fetch80DDeductions,
  create80DDeduction,
  update80DDeduction,
  softDelete80DDeduction,
} from "../../../services/deduction80DService";
import Deduction80DSummaryTable from "../../../components/80deduction/Deduction80DSummaryTable";
import Add80DModal from "../../../components/80deduction/Add80DModal";
import Update80DModal from "../../../components/80deduction/Update80DModal";

const FINANCIAL_YEAR_MASTER_ID = "1";

export default function Deduction80DScreen() {
  const records = deduction80DStore((s) => s.records);
  const loading = deduction80DStore((s) => s.loading);
  const error = deduction80DStore((s) => s.error);
  const setRecords = deduction80DStore((s) => s.setRecords);
  const setLoading = deduction80DStore((s) => s.setLoading);
  const setError = deduction80DStore((s) => s.setError);
  const [submitting, setSubmitting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Deduction80DRecord | null>(null);
  const memberId = "M001";
  const userId = "USER001";

  const loadDeductions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetch80DDeductions(memberId);
      setRecords(data);
    } catch {
      setError("Failed to load 80D deductions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => { loadDeductions(); }, [loadDeductions]);

  const handleAdd = async (data: Deduction80DFormData) => {
    setSubmitting(true);
    try {
      await create80DDeduction(data, memberId, FINANCIAL_YEAR_MASTER_ID, userId);
      setAddModalOpen(false);
      await loadDeductions();
    } catch {
      setError("Failed to add 80D deduction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: Deduction80DFormData) => {
    if (!selectedRecord) return;
    setSubmitting(true);
    try {
      await update80DDeduction(selectedRecord.__id__, data, userId);
      setUpdateModalOpen(false);
      setSelectedRecord(null);
      await loadDeductions();
    } catch {
      setError("Failed to update 80D deduction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: Deduction80DRecord) => {
    try {
      await softDelete80DDeduction(record.__id__, userId);
      await loadDeductions();
    } catch {
      setError("Failed to delete 80D deduction. Please try again.");
    }
  };

  const handleEdit = (record: Deduction80DRecord) => {
    setSelectedRecord(record);
    setUpdateModalOpen(true);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2 flex-1">
            <Text className="text-section-title text-textprimary flex-1">
              3C. 80D deduction (In case of Business/ Profession OR If not considered in Form 16?) (Please Specify)
            </Text>
            <Text className="text-info text-base">{String.fromCharCode(8505)}</Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-1.5 bg-primary px-4 py-2.5 rounded-lg"
            onPress={() => setAddModalOpen(true)}
          >
            <Text className="text-white text-base font-bold">{String.fromCharCode(43)}</Text>
            <Text className="text-white text-button font-bold">Add Deduction 80 D</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 py-3 mb-4 bg-danger/10 border border-danger/20 rounded-lg">
          <Text className="text-danger text-supporting">
            Fill the above section only if:
            {"\n"}1) You have chosen the old tax regime or are not sure which tax regime you've chosen, AND
            {"\n"}2) You have/ Plan to claim any of the deductions mentioned above.
          </Text>
        </View>

        {loading && (
          <View className="py-8 items-center">
            <Text className="text-body text-textmuted">Loading 80D deductions...</Text>
          </View>
        )}

        {error && !loading && (
          <View className="py-8 items-center bg-danger/10 rounded-lg border border-danger/20">
            <Text className="text-body text-danger font-bold">{error}</Text>
            <TouchableOpacity className="mt-3 px-4 py-2 bg-primary rounded-lg" onPress={loadDeductions}>
              <Text className="text-white text-button font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && (
          <View className="bg-surface border border-border rounded-xl p-5 overflow-auto">
            <Deduction80DSummaryTable
              records={records}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </View>
        )}
      </ScrollView>

      <Add80DModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAdd}
        submitting={submitting}
      />

      <Update80DModal
        isOpen={updateModalOpen}
        onClose={() => { setUpdateModalOpen(false); setSelectedRecord(null); }}
        onSubmit={handleUpdate}
        submitting={submitting}
        record={selectedRecord}
      />
    </View>
  );
}



