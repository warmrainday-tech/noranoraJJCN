/**
 * nora-cdn API 客户端
 * 在 Cloudflare Workers 部署后替换 WORKER_URL 即可
 */
const WORKER_URL = 'https://nora-cdn.YOUR_SUBDOMAIN.workers.dev';

const API = {
  /**
   * 上传图片到 GitHub 图床
   * @param {File} file
   * @returns {Promise<{url: string, path: string}>}
   */
  async upload(file) {
    const form = new FormData();
    form.append('file', file);
    const r = await fetch(`${WORKER_URL}/upload`, { method: 'POST', body: form });
    if (!r.ok) throw new Error('Upload failed');
    return r.json();
  },

  /**
   * 获取代理后的图片 URL
   * @param {string} path — 如 "images/uploads/xxx.jpg"
   * @returns {string}
   */
  imageUrl(path) {
    return `${WORKER_URL}/image?path=${encodeURIComponent(path)}`;
  },

  /**
   * 读取远程配置
   * @returns {Promise<object>}
   */
  async loadConfig() {
    const r = await fetch(`${WORKER_URL}/config`);
    if (!r.ok) return {};
    return r.json();
  },

  /**
   * 保存远程配置
   * @param {object} config
   */
  async saveConfig(config) {
    const r = await fetch(`${WORKER_URL}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!r.ok) throw new Error('Save failed');
    return r.json();
  },
};