import { create } from 'zustand';
import type { Store, Product, Sale, Commission } from '../types';
import { initialStores, initialProducts } from '../data';

interface StoreState {
  stores: Store[];
  products: Product[];
  sales: Sale[];
  commissions: Commission[];
  promotions: any[];

  addStore: (store: Omit<Store, 'id'>) => string;
  updateStore: (store: Store) => void;
  deleteStore: (id: string) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => string;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => string;
  updateSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  
  addCommission: (commission: Omit<Commission, 'id' | 'createdAt'>) => string;
  updateCommission: (commission: Commission) => void;
  deleteCommission: (id: string) => void;
  
  getStoreById: (id: string) => Store | undefined;
  getStoreProducts: (storeId: string) => Product[];
  getStoreSales: (storeId: string) => Sale[];
  getStoreCommissions: (storeId: string) => Commission[];
}

export const useStoreStore = create<StoreState>()((set, get) => ({
  stores: initialStores,
  products: initialProducts,
  sales: [],
  commissions: [],
  promotions: [],

  addStore: (store) => {
    const id = crypto.randomUUID();
    set((state) => ({
      stores: [...state.stores, { ...store, id }]
    }));
    return id;
  },

  updateStore: (store) => {
    set((state) => ({
      stores: state.stores.map((s) => s.id === store.id ? store : s)
    }));
  },

  deleteStore: (id) => {
    set((state) => ({
      stores: state.stores.filter((s) => s.id !== id)
    }));
  },

  addProduct: (product) => {
    const id = crypto.randomUUID();
    set((state) => ({
      products: [...state.products, { ...product, id }]
    }));
    return id;
  },

  updateProduct: (product) => {
    set((state) => ({
      products: state.products.map((p) => p.id === product.id ? product : p)
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id)
    }));
  },

  addSale: (sale) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newSale = { ...sale, id, createdAt };

    set((state) => ({
      sales: [...state.sales, newSale]
    }));

    return id;
  },

  updateSale: (sale) => {
    set((state) => ({
      sales: state.sales.map((s) => s.id === sale.id ? sale : s)
    }));
  },

  deleteSale: (id) => {
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id)
    }));
  },

  addCommission: (commission) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newCommission = { ...commission, id, createdAt };

    set((state) => ({
      commissions: [...state.commissions, newCommission]
    }));

    return id;
  },

  updateCommission: (commission) => {
    set((state) => ({
      commissions: state.commissions.map((c) => c.id === commission.id ? commission : c)
    }));
  },

  deleteCommission: (id) => {
    set((state) => ({
      commissions: state.commissions.filter((c) => c.id !== id)
    }));
  },

  getStoreById: (id) => {
    const state = get();
    return state.stores.find((s) => s.id === id);
  },

  getStoreProducts: (storeId) => {
    const state = get();
    return state.products.filter((p) => p.storeId === storeId);
  },

  getStoreSales: (storeId) => {
    const state = get();
    return state.sales.filter((s) => s.product?.storeId === storeId);
  },

  getStoreCommissions: (storeId) => {
    const state = get();
    const storeSales = state.sales.filter((s) => s.product?.storeId === storeId);
    const saleIds = storeSales.map((s) => s.id);
    return state.commissions.filter((c) => saleIds.includes(c.saleId));
  }
}));
