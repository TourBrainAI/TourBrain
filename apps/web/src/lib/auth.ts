import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function ensureUserExists() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("User not authenticated");
  }

  // Check if user exists in our database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Create user if doesn't exist
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });
  }

  return dbUser;
}

export async function getUserWithOrganizations(userId?: string) {
  const { userId: authUserId } = await auth();
  const clerkId = userId || authUserId;

  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      ownedOrganizations: true,
      organizationMemberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  return user;
}

export async function createOrganization(data: {
  name: string;
  type: "VENUE" | "PROMOTER" | "AGENCY" | "ARTIST_MANAGEMENT" | "OTHER";
  description?: string;
  website?: string;
}) {
  const user = await ensureUserExists();

  const organization = await prisma.organization.create({
    data: {
      ...data,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  return organization;
}

export async function getCurrentUser() {
  const user = await ensureUserExists();
  const userWithOrgs = await getUserWithOrganizations(user.clerkId);

  if (!userWithOrgs) {
    throw new Error("User not found");
  }

  // Get the primary organization (owned org or first membership)
  let organizationId: string | null = null;

  if (userWithOrgs.ownedOrganizations.length > 0) {
    organizationId = userWithOrgs.ownedOrganizations[0].id;
  } else if (userWithOrgs.organizationMemberships.length > 0) {
    organizationId = userWithOrgs.organizationMemberships[0].organizationId;
  }

  return {
    user: userWithOrgs,
    organizationId,
    role: userWithOrgs.role,
  };
}

export async function requireOrganization() {
  const { user, organizationId } = await getCurrentUser();

  if (!organizationId) {
    throw new Error("User must be associated with an organization");
  }

  return { user, organizationId };
}

export async function requireAdmin() {
  const { user, role } = await getCurrentUser();

  if (role !== "OWNER" && role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return { user, role };
}

export async function getCurrentOrganization() {
  const { user, organizationId } = await getCurrentUser();

  if (!organizationId) {
    throw new Error("User is not associated with any organization");
  }

  // Get the organization with full details
  let organization;

  // Check if user owns this organization
  const ownedOrg = user.ownedOrganizations.find(
    (org) => org.id === organizationId
  );
  if (ownedOrg) {
    organization = ownedOrg;
  } else {
    // Get from membership
    const membership = user.organizationMemberships.find(
      (m) => m.organizationId === organizationId
    );
    if (membership) {
      organization = membership.organization;
    }
  }

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
}
