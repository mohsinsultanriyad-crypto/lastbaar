// Soft delete leave
export async function deleteLeave(id: string) {
  const actorId = localStorage.getItem('fw_session_id');
  const actorRole = localStorage.getItem('fw_session_role');
  await api.delete(`/api/leaves/${id}`, {
    headers: {
      'X-Actor-Id': actorId,
      'X-Actor-Role': actorRole
    }
  });
}

// Soft delete advance
export async function deleteAdvance(id: string) {
  const actorId = localStorage.getItem('fw_session_id');
  const actorRole = localStorage.getItem('fw_session_role');
  await api.delete(`/api/advances/${id}`, {
    headers: {
      'X-Actor-Id': actorId,
      'X-Actor-Role': actorRole
    }
  });
}


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


const db = {
  getAll,
  saveBatch,
};
export default db;
export { db };
// Default export for compatibility (must be at the end of the file)
