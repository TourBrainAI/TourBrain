/**
 * Activity Logging System
 *
 * Tracks user actions and changes across the platform for:
 * - Audit trails
 * - Collaboration transparency
 * - Analytics and insights
 * - Debugging and support
 */

import { prisma } from "@/lib/prisma";

interface ActivityLogParams {
  organizationId: string;
  showId?: string;
  tourId?: string;
  userId?: string; // Internal user ID
  email?: string; // External collaborator email
  action: string; // What happened
  entityType: string; // What was affected
  entityId: string; // ID of affected entity
  changes?: Record<string, any>; // What fields changed (for updates)
  metadata?: Record<string, any>; // Additional context
}

/**
 * Log an activity/action in the system
 */
export async function logActivity(params: ActivityLogParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        organizationId: params.organizationId,
        showId: params.showId,
        tourId: params.tourId,
        userId: params.userId,
        email: params.email,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        changes: params.changes || null,
        metadata: params.metadata || null,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - logging failures shouldn't break the main operation
  }
}

/**
 * Get recent activity for an organization
 */
export async function getRecentActivity(
  organizationId: string,
  options: {
    showId?: string;
    tourId?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { showId, tourId, limit = 50, offset = 0 } = options;

  return prisma.activityLog.findMany({
    where: {
      organizationId,
      ...(showId && { showId }),
      ...(tourId && { tourId }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
    include: {
      show: {
        select: {
          id: true,
          date: true,
          venue: {
            select: {
              name: true,
              city: true,
            },
          },
        },
      },
      tour: {
        select: {
          id: true,
          name: true,
          artist: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Common activity actions for consistency
 */
export const ACTIVITY_ACTIONS = {
  // Show actions
  SHOW_CREATED: "created_show",
  SHOW_UPDATED: "updated_show",
  SHOW_DELETED: "deleted_show",

  // Collaboration actions
  COLLABORATOR_INVITED: "invited_collaborator",
  COLLABORATOR_REMOVED: "removed_collaborator",
  SHARED_SHOW_ACCESSED: "accessed_shared_show",

  // Export actions
  DAY_SHEET_EXPORTED: "exported_day_sheet",
  TOUR_DATA_EXPORTED: "exported_tour_data",
  CALENDAR_EXPORTED: "exported_calendar",

  // Tour actions
  TOUR_CREATED: "created_tour",
  TOUR_UPDATED: "updated_tour",
  TOUR_DELETED: "deleted_tour",

  // Routing actions
  ROUTING_SCENARIO_GENERATED: "generated_routing_scenario",
  ROUTING_SCENARIO_APPLIED: "applied_routing_scenario",

  // Venue actions
  VENUE_CREATED: "created_venue",
  VENUE_UPDATED: "updated_venue",
  VENUE_DELETED: "deleted_venue",
} as const;

/**
 * Common entity types for consistency
 */
export const ENTITY_TYPES = {
  SHOW: "show",
  TOUR: "tour",
  VENUE: "venue",
  ARTIST: "artist",
  COLLABORATOR: "collaborator",
  ROUTING_SCENARIO: "routing_scenario",
} as const;
