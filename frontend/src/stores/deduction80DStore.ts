import { create } from "zustand";
import { Deduction80DRecord, Deduction80DFormData } from "../../shared-types/deduction80D.types";

interface Deduction80DStoreState {
  records: Deduction80DRecord[];
  loading: boolean;
  error: string | null;
  isAddModalOpen: boolean;
  isUpdateModalOpen: boolean;
  selectedRecord: Deduction80DRecord | null;
  currentPage: number;
  rowsPerPage: number;

  setRecords: (records: Deduction80DRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openUpdateModal: (record: Deduction80DRecord) => void;
  closeUpdateModal: () => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}

export const deduction80DStore = create<Deduction80DStoreState>((set) => ({
  records: [],
  loading: false,
  error: null,
  isAddModalOpen: false,
  isUpdateModalOpen: false,
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
  setCurrentPage: (page) => set({ currentPage: page }),
  setRowsPerPage: (rows) => set({ rowsPerPage: rows, currentPage: 1 }),
}));

