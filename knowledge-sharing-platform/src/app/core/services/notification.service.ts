import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Notification } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private readonly defaultDuration = 5000; // 5 seconds

  /**
   * Show success notification
   */
  success(title: string, message: string, duration?: number): void {
    this.addNotification('success', title, message, duration);
  }

  /**
   * Show error notification
   */
  error(title: string, message: string, duration?: number): void {
    this.addNotification('error', title, message, duration || 0); // Error notifications don't auto-dismiss
  }

  /**
   * Show warning notification
   */
  warning(title: string, message: string, duration?: number): void {
    this.addNotification('warning', title, message, duration);
  }

  /**
   * Show info notification
   */
  info(title: string, message: string, duration?: number): void {
    this.addNotification('info', title, message, duration);
  }

  /**
   * Remove notification by ID
   */
  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }

  /**
   * Private method to add notification
   */
  private addNotification(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration?: number
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration: duration ?? this.defaultDuration,
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);

    // Auto-remove notification after duration (if duration > 0)
    if (notification.duration && notification.duration > 0) {
      timer(notification.duration).subscribe(() => {
        this.remove(notification.id);
      });
    }
  }

  /**
   * Generate unique ID for notification
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}