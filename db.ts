

import { api } from './api';

function mapId(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(mapId);
  if (obj._id && !obj.id) return { ...obj, id: obj._id };
  return obj;
}


// Legacy/compatibility: getAll(key) and saveBatch(key, items)
export async function getAll(key) {
  switch (key) {
    case 'workers':
      return mapId(await api.get('/api/workers'));
    case 'shifts':
      return mapId(await api.get('/api/attendance'));
    case 'leaves':
      return mapId(await api.get('/api/leaves'));
    case 'advanceRequests':
      return mapId(await api.get('/api/advances'));
    case 'posts':
      return mapId(await api.get('/api/posts'));
    case 'announcements':
      return mapId(await api.get('/api/announcements'));
    default:
      return [];
  }
}

export async function saveBatch(key, items) {
  for (const item of items) {
    if (!item) continue;
    switch (key) {
      case 'workers':
        if (item.id) await api.put(`/api/workers/${item.id}`, item);
        else await api.post('/api/workers', item);
        break;
      case 'shifts':
        if (item.id) await api.put(`/api/attendance/${item.id}/status`, item);
        else await api.post('/api/attendance', item);
        break;
      case 'leaves':
        if (item.id) await api.put(`/api/leaves/${item.id}`, item);
        else await api.post('/api/leaves', item);
        break;
      case 'advanceRequests':
        if (item.id) await api.put(`/api/advances/${item.id}`, item);
        else await api.post('/api/advances', item);
        break;
      case 'posts':
        if (item.id) await api.put(`/api/posts/${item.id}`, item);
        else await api.post('/api/posts', item);
        break;
      case 'announcements':
        if (item.id) await api.put(`/api/announcements/${item.id}`, item);
        else await api.post('/api/announcements', item);
        break;
      default:
        break;
    }
  }
}

// Modern API (unchanged)
export const db = {
  async getAllWorkers() {
    const res = await api.get('/api/workers');
    return mapId(res);
  },
  async addWorker(data) {
    const res = await api.post('/api/workers', data);
    return mapId(res);
  },
  async updateWorker(id, data) {
    const res = await api.put(`/api/workers/${id}`, data);
    return mapId(res);
  },
  async deleteWorker(id) {
    return api.delete(`/api/workers/${id}`);
  },

  async getAllShifts() {
    const res = await api.get('/api/attendance');
    return mapId(res);
  },
  async getMyShifts() {
    const res = await api.get('/api/attendance/me');
    return mapId(res);
  },
  async addShift(data) {
    const res = await api.post('/api/attendance', data);
    return mapId(res);
  },
  async updateShiftStatus(id, data) {
    const res = await api.put(`/api/attendance/${id}/status`, data);
    return mapId(res);
  },


  async getAllLeaves() {
    const res = await api.get('/api/leaves');
    return mapId(res);
  },
  async addLeave(data) {
    const res = await api.post('/api/leaves', data);
    return mapId(res);
  },
  async updateLeave(id, data) {
    const res = await api.put(`/api/leaves/${id}`, data);
    return mapId(res);
  },
  
  async getAllAdvances() {
    const res = await api.get('/api/advances');
    return mapId(res);
  },
  async addAdvance(data) {
    const res = await api.post('/api/advances', data);
    return mapId(res);
  },
  async updateAdvance(id, data) {
    const res = await api.put(`/api/advances/${id}`, data);
    return mapId(res);
  },
  
  async getAllPosts() {
    const res = await api.get('/api/posts');
    return mapId(res);
  },
  async addPost(data) {
    const res = await api.post('/api/posts', data);
    return mapId(res);
  },
  
  async getAllAnnouncements() {
    const res = await api.get('/api/announcements');
    return mapId(res);
  },
  async addAnnouncement(data) {
    const res = await api.post('/api/announcements', data);
    return mapId(res);
  },
};

// Default export for compatibility (must be at the end of the file)
export default db;
