import { create } from 'zustand';
import { BankRecord, BankFormData } from '../../shared-types/bank.types';

interface BankStoreState {
  records: BankRecord[];
  loading: boolean;
  error: string | null;
  isAddModalOpen: boolean;
  isUpdateModalOpen: boolean;
  isInfoModalOpen: boolean;
  selectedRecord: BankRecord | null;
  currentPage: number;
  rowsPerPage: number;

  setRecords: (records: BankRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openUpdateModal: (record: BankRecord) => void;
  closeUpdateModal: () => void;
  openInfoModal: (record: BankRecord) => void;
  closeInfoModal: () => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}

export const bankStore = create<BankStoreState>((set) => ({
  records: [],
  loading: false,
  error: null,
  isAddModalOpen: false,
  isUpdateModalOpen: false,
  isInfoModalOpen: false,
  selectedRecord: null,
  currentPage: 1,
  rowsPerPage: 5,

  setRecords: (records) => set({ records, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  openAddModal: () => set({ isAddModalOpen: true, selectedRecord: null }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openUpdateModal: (record) => set({ isUpdateModalOpen: true, selectedRecord: record }),
  closeUpdateModal: () => set({ isUpdateModalOpen: false, selectedRecord: null }),
  openInfoModal: (record) => set({ isInfoModalOpen: true, selectedRecord: record }),
  closeInfoModal: () => set({ isInfoModalOpen: false, selectedRecord: null }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setRowsPerPage: (rows) => set({ rowsPerPage: rows, currentPage: 1 }),
}));
