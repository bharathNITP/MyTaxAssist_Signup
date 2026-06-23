import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BankRecord, BankFormData } from '../../../../../shared-types/bank.types';
import { bankStore } from '../../../stores/bankStore';
import { fetchBankAccounts, createBankAccount, updateBankAccount, softDeleteBankAccount } from '../../../services/bankService';
import BankDetailsSummaryTable from '../../../components/bank/BankDetailsSummaryTable';
import AddBankDetailsModal from '../../../components/bank/AddBankDetailsModal';
import UpdateBankDetailsModal from '../../../components/bank/UpdateBankDetailsModal';
import BankInfoModal from '../../../components/bank/BankInfoModal';

const FINANCIAL_YEAR_MASTER_ID = 'FY2025-26';

export default function BankDetailsScreen() {
  const records = bankStore((s) => s.records);
  const loading = bankStore((s) => s.loading);
  const error = bankStore((s) => s.error);
  const setRecords = bankStore((s) => s.setRecords);
  const setLoading = bankStore((s) => s.setLoading);
  const setError = bankStore((s) => s.setError);
  const [submitting, setSubmitting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BankRecord | null>(null);
  const memberId = 'M001';
  const userId = 'USER001';

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBankAccounts(memberId);
      setRecords(data);
    } catch {
      setError('Failed to load bank accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [memberId]);
  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  const handleAdd = async (data: BankFormData) => {
    setSubmitting(true);
    try { await createBankAccount(data, memberId, FINANCIAL_YEAR_MASTER_ID, userId); setAddModalOpen(false); await loadAccounts(); }
    catch { setError('Failed to add bank account. Please try again.'); }
    finally { setSubmitting(false); }
  };
  const handleUpdate = async (data: BankFormData) => {
    if (!selectedRecord) return;
    setSubmitting(true);
    try { await updateBankAccount(selectedRecord.Bank_ID, data, memberId, userId); setUpdateModalOpen(false); setSelectedRecord(null); await loadAccounts(); }
    catch { setError('Failed to update bank account. Please try again.'); }
    finally { setSubmitting(false); }
  };
  const handleDelete = async (record: BankRecord) => {
    try { await softDeleteBankAccount(record.Bank_ID, userId); await loadAccounts(); }
    catch { setError('Failed to delete bank account. Please try again.'); }
  };
  const handleEdit = (record: BankRecord) => { setSelectedRecord(record); setUpdateModalOpen(true); };
  const handleInfo = (record: BankRecord) => { setSelectedRecord(record); setInfoModalOpen(true); };

  const updateInitialData: BankFormData | null = selectedRecord ? {
    Bank_Name: selectedRecord.Bank_Name,
    Account_Number: selectedRecord.Account_Number,
    IFSC_Code: selectedRecord.IFSC_Code,
    Account_Type: selectedRecord.Account_Type as BankFormData['Account_Type'],
    Primary_Account: selectedRecord.Primary_Account === 'Primary',
  } : null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Text className="text-section-title text-textprimary">2. Bank Details</Text>
            <Text className="text-info text-base">{String.fromCharCode(8505)}</Text>
          </View>
          <TouchableOpacity className="flex-row items-center gap-1.5 bg-primary px-4 py-2.5 rounded-lg" onPress={() => setAddModalOpen(true)}>
            <Text className="text-white text-base font-bold">{String.fromCharCode(43)}</Text>
            <Text className="text-white text-button font-bold">Add Account</Text>
          </TouchableOpacity>
        </View>
        {loading && <View className="py-8 items-center"><Text className="text-body text-textmuted">Loading bank accounts...</Text></View>}
        {error && !loading && (
          <View className="py-8 items-center bg-danger/10 rounded-lg border border-danger/20">
            <Text className="text-body text-danger font-bold">{error}</Text>
            <TouchableOpacity className="mt-3 px-4 py-2 bg-primary rounded-lg" onPress={loadAccounts}><Text className="text-white text-button font-bold">Retry</Text></TouchableOpacity>
          </View>
        )}
        {!loading && !error && (
          <View className="bg-surface border border-border rounded-xl p-5 overflow-auto">
            <BankDetailsSummaryTable records={records} onEdit={handleEdit} onDelete={handleDelete} onInfo={handleInfo} />
            <View className="flex-row items-center gap-2 mt-5 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <Text className="text-warning text-base">{String.fromCharCode(9888)}</Text>
              <Text className="text-body text-warning font-semibold flex-1">Refund if any will be credited in the Primary Account selected here.</Text>
            </View>
          </View>
        )}
      </ScrollView>
      <AddBankDetailsModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAdd} submitting={submitting} />
      <UpdateBankDetailsModal isOpen={updateModalOpen} onClose={() => { setUpdateModalOpen(false); setSelectedRecord(null); }} onSubmit={handleUpdate} submitting={submitting} initialData={updateInitialData} />
      <BankInfoModal isOpen={infoModalOpen} onClose={() => { setInfoModalOpen(false); setSelectedRecord(null); }} record={selectedRecord} />
    </View>
  );
}