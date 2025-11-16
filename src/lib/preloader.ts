/**
 * Data Preloader
 *
 * @description Preloads and caches frequently accessed data
 */

import type { SupabaseClient } from '@supabase/supabase-js';

class Preloader {
  private preloadedData: Map<string, unknown> = new Map();
  private preloadQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;

  /**
   * Preload document templates
   */
  async preloadTemplates(supabaseClient: SupabaseClient): Promise<void> {
    if (this.preloadedData.has('templates')) {
      return;
    }

    const { data, error } = await supabaseClient
      .from('document_templates')
      .select('id, name, category, description, is_active')
      .eq('is_active', true)
      .order('name');

    if (!error && data) {
      this.preloadedData.set('templates', data);
    }
  }

  /**
   * Preload user profile
   */
  async preloadUserProfile(supabaseClient: SupabaseClient, userId: string): Promise<void> {
    const cacheKey = `profile_${userId}`;

    if (this.preloadedData.has(cacheKey)) {
      return;
    }

    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      this.preloadedData.set(cacheKey, data);
    }
  }

  /**
   * Preload user documents
   */
  async preloadUserDocuments(supabaseClient: SupabaseClient, userId: string): Promise<void> {
    const cacheKey = `documents_${userId}`;

    if (this.preloadedData.has(cacheKey)) {
      return;
    }

    const { data, error } = await supabaseClient
      .from('generated_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      this.preloadedData.set(cacheKey, data);
    }
  }

  /**
   * Get preloaded data
   */
  get<T = unknown>(key: string): T | null {
    return (this.preloadedData.get(key) as T) || null;
  }

  /**
   * Check if data is preloaded
   */
  has(key: string): boolean {
    return this.preloadedData.has(key);
  }

  /**
   * Set preloaded data
   */
  set<T = unknown>(key: string, data: T): void {
    this.preloadedData.set(key, data);
  }

  /**
   * Invalidate cached data
   */
  invalidate(key: string): void {
    this.preloadedData.delete(key);
  }

  /**
   * Invalidate all cached data
   */
  invalidateAll(): void {
    this.preloadedData.clear();
  }

  /**
   * Add task to preload queue
   */
  addToQueue(task: () => Promise<void>): void {
    this.preloadQueue.push(task);
    this.processQueue();
  }

  /**
   * Process preload queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const task = this.preloadQueue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.warn('Preload task failed:', error);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Prefetch data when browser is idle
   */
  prefetchOnIdle(tasks: Array<() => Promise<void>>): void {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(() => {
        tasks.forEach(task => this.addToQueue(task));
      });
    } else {
      setTimeout(() => {
        tasks.forEach(task => this.addToQueue(task));
      }, 1000);
    }
  }
}

export const preloader = new Preloader();
