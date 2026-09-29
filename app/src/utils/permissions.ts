import { UserRole } from '../types/store';

export type ActionType = 
  | 'view_command_center'
  | 'view_events_hq'
  | 'view_member_portal'
  | 'edit_member'
  | 'remove_member'
  | 'change_member_role'
  | 'approve_request'
  | 'reject_request'
  | 'create_event'
  | 'publish_event'
  | 'mark_event_live'
  | 'complete_event'
  | 'cancel_event'
  | 'check_in_attendee'
  | 'compose_announcement'
  | 'register_for_event'
  | 'cancel_event_registration'
  | 'request_project_join';

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

export function can(
  role: UserRole,
  action: ActionType,
  _resource?: any,
  _context?: any
): PermissionResult {
  switch (action) {
    case 'view_command_center':
      if (role === 'admin') return { allowed: true };
      return { allowed: false, reason: 'Command Center is restricted to Admins.' };

    case 'view_events_hq':
      if (role === 'admin' || role === 'event_lead') return { allowed: true };
      return { allowed: false, reason: 'Events HQ is restricted to Event Leads and Admins.' };

    case 'view_member_portal':
      return { allowed: true };

    case 'edit_member':
    case 'remove_member':
    case 'change_member_role':
      if (role === 'admin') return { allowed: true };
      return { allowed: false, reason: 'Only Admins can modify club roster and roles.' };

    case 'approve_request':
    case 'reject_request':
      if (role === 'admin') return { allowed: true };
      return { allowed: false, reason: 'Approvals queue can only be handled by Admins.' };

    case 'create_event':
    case 'publish_event':
    case 'mark_event_live':
    case 'complete_event':
    case 'cancel_event':
      if (role === 'admin' || role === 'event_lead') return { allowed: true };
      return { allowed: false, reason: 'Only Event Leads and Admins can manage event lifecycles.' };

    case 'check_in_attendee':
      if (role === 'admin' || role === 'event_lead') return { allowed: true };
      return { allowed: false, reason: 'Only Event Leads or Admins can check in attendees.' };

    case 'compose_announcement':
      if (role === 'admin' || role === 'event_lead') return { allowed: true };
      return { allowed: false, reason: 'Only Event Leads and Admins can broadcast announcements.' };

    case 'register_for_event':
    case 'cancel_event_registration':
    case 'request_project_join':
      return { allowed: true };

    default:
      return { allowed: false, reason: 'Action not authorized.' };
  }
}
