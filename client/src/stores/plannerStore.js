import { create } from 'zustand';
import plannerService from '../services/planner.js';

const usePlannerStore = create((set) => ({
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
  
  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const plans = await plannerService.getPlans();
      set({ plans, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  getPlan: async (id) => {
    set({ loading: true, error: null });
    try {
      const plan = await plannerService.getPlan(id);
      set({ 
        currentPlan: {
          ...plan,
          total_hours: Number(plan.total_hours || 0) // Ensure number
        }, 
        loading: false 
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  createPlan: async (planData) => {
    set({ loading: true, error: null });
    try {
      const plan = await plannerService.createPlan(planData);
      set((state) => ({ plans: [plan, ...state.plans], loading: false }));
      return plan;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  
  deletePlan: async (id) => {
    set({ loading: true, error: null });
    try {
      await plannerService.deletePlan(id);
      set((state) => ({
        plans: state.plans.filter(plan => plan.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
updateScheduleItem: async (id, isCompleted) => {
  set({ loading: true, error: null });
  try {
    const updatedItem = await plannerService.updateScheduleItem(id, isCompleted);

    set((state) => ({
      currentPlan: {
        ...state.currentPlan,
        schedule: state.currentPlan.schedule.map(item => 
          item.id === id
            ? { ...item, is_completed: updatedItem.is_completed }  // Only update status, keep rest
            : item
        ),
      },
      loading: false,
    }));
  } catch (err) {
    set({ error: err.message, loading: false });
  }
},

}));

export default usePlannerStore;