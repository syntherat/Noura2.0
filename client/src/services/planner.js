import api from './api.js';

// Add response transformer
const transformNumbers = (data) => {
  if (Array.isArray(data)) {
    return data.map(transformNumbers);
  }
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (key.endsWith('_hours') || key === 'complexity') {
          return [key, Number(value)];
        }
        return [key, value];
      })
    );
  }
  return data;
};

const plannerService = {
  async getPlans() {
    const res = await api.get('/api/planner');
    console.log(res);
    return res.data;
  },
  
  async getPlan(id) {
    const res = await api.get(`/api/planner/${id}`);
    console.log(res);
    return transformNumbers(res.data);
  },
  
  async createPlan(planData) {
    const formData = new FormData();
    
    // Append all fields to formData
    for (const key in planData) {
      if (key === 'file' && planData[key]) {
        formData.append('file', planData[key]);
      } else if (planData[key] !== undefined) {
        formData.append(key, planData[key]);
      }
    }
    
    const res = await api.post('/api/planner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  
  async deletePlan(id) {
    const res = await api.delete(`/api/planner/${id}`);
    return res.data;
  },
  
  async updateScheduleItem(id, isCompleted) {
    const res = await api.patch(`/api/planner/schedule/${id}`, { isCompleted });
    return res.data;
  },
};

export default plannerService;