

import { api } from './api';

function mapId(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(mapId);
  if (obj._id && !obj.id) return { ...obj, id: obj._id };
  return obj;
}

export const db = {
  // WORKERS
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

  // SHIFTS / ATTENDANCE
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

  // LEAVES
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

  // ADVANCES
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

  // POSTS (Site Feed)
  async getAllPosts() {
    const res = await api.get('/api/posts');
    return mapId(res);
  },
  async addPost(data) {
    const res = await api.post('/api/posts', data);
    return mapId(res);
  },

  // ANNOUNCEMENTS
  async getAllAnnouncements() {
    const res = await api.get('/api/announcements');
    return mapId(res);
  },
  async addAnnouncement(data) {
    const res = await api.post('/api/announcements', data);
    return mapId(res);
  },
};
