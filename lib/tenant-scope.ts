import {
  pasaxStore,
  type ManagedUser,
  type NodeTelemetry,
  type ThreatEvent,
  type ManagedLicenseKey,
} from "@/lib/store"

export interface SessionLike {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    role?: string
  } | null
}

export interface SessionContext {
  email: string
  role: ManagedUser["role"]
  user: ManagedUser
}

/**
 * Resolve the currently logged-in user into a guaranteed ManagedUser record.
 * Rehydrates self-registered users cleanly (with empty assignedNodeIds) if the
 * in-memory store reset while the browser still holds a valid NextAuth JWT.
 */
export function ensureSessionUser(session: SessionLike | null | undefined): SessionContext | null {
  const rawEmail = session?.user?.email
  if (!rawEmail) return null

  const email = rawEmail.toLowerCase().trim()
  const sessionRole = ((session?.user as any)?.role || "Admin") as ManagedUser["role"]

  let user = pasaxStore.getUser(email)
  if (!user) {
    const created = pasaxStore.createUser({
      name: session?.user?.name || email.split("@")[0].toUpperCase(),
      email,
      role: sessionRole,
      plan: "pro",
      serverQuota: sessionRole === "Superadmin" ? 100 : 10,
      organization: `Tenant ${email.split("@")[0].toUpperCase()}`,
      assignedNodeIds: [],
    })
    user = created.user
  }

  return {
    email,
    role: user.role || sessionRole,
    user,
  }
}

/**
 * Superadmin: sees all users.
 * Admin: sees themselves + all child users created by them (`createdBy === admin.email`).
 * Programmer / DevOps / User / Support / Teknis: sees only themselves.
 */
export function getScopedUsers(
  session: SessionLike | null | undefined,
  allUsers: ManagedUser[] = pasaxStore.getUsers()
): ManagedUser[] {
  const ctx = ensureSessionUser(session)
  if (!ctx) return []

  if (ctx.role === "Superadmin") {
    return allUsers
  }

  if (ctx.role === "Admin") {
    return allUsers.filter(
      (u) =>
        u.id === ctx.user.id ||
        u.email.toLowerCase() === ctx.email ||
        u.createdBy?.toLowerCase() === ctx.email ||
        u.createdBy === ctx.user.id
    )
  }

  return allUsers.filter(
    (u) => u.id === ctx.user.id || u.email.toLowerCase() === ctx.email
  )
}

/**
 * Superadmin: sees all nodes.
 * Admin: sees nodes assigned to themselves or to child users created by them.
 * Child roles: see only nodes assigned directly to them.
 */
export function getScopedNodes(
  session: SessionLike | null | undefined,
  allNodes: NodeTelemetry[]
): NodeTelemetry[] {
  const ctx = ensureSessionUser(session)
  if (!ctx) return []

  if (ctx.role === "Superadmin") {
    return allNodes
  }

  const scopedUsers = getScopedUsers(session)
  const scopedUserIds = new Set(scopedUsers.map((u) => u.id))
  const assignedNodeIds = new Set(
    scopedUsers.flatMap((u) => u.assignedNodeIds || [])
  )

  return allNodes.filter(
    (n) =>
      assignedNodeIds.has(n.node_id) ||
      (n.project_id ? scopedUserIds.has(n.project_id) : false) ||
      Boolean(n.assignedUserIds?.some((uid) => scopedUserIds.has(uid)))
  )
}

/**
 * Superadmin: sees all license keys.
 * Admin: sees license keys belonging to themselves or child users created by them.
 * Child roles: see only their own license keys.
 */
export function getScopedLicenseKeys(
  session: SessionLike | null | undefined,
  allKeys: ManagedLicenseKey[] = pasaxStore.getLicenseKeys()
): ManagedLicenseKey[] {
  const ctx = ensureSessionUser(session)
  if (!ctx) return []

  if (ctx.role === "Superadmin") {
    return allKeys
  }

  const scopedUsers = getScopedUsers(session)
  const scopedUserIds = new Set(scopedUsers.map((u) => u.id))
  const scopedEmails = new Set(scopedUsers.map((u) => u.email.toLowerCase()))

  return allKeys.filter(
    (k) =>
      scopedUserIds.has(k.userId) ||
      scopedEmails.has(k.userEmail.toLowerCase())
  )
}

/**
 * Superadmin: sees all threats.
 * Other roles: see only threats originating from their scoped VPS nodes or project_id.
 */
export function getScopedThreats(
  session: SessionLike | null | undefined,
  allThreats: ThreatEvent[],
  scopedNodes: NodeTelemetry[]
): ThreatEvent[] {
  const ctx = ensureSessionUser(session)
  if (!ctx) return []

  if (ctx.role === "Superadmin") {
    return allThreats
  }

  const scopedNodeIds = new Set(scopedNodes.map((n) => n.node_id))
  const scopedUserIds = new Set(getScopedUsers(session).map((u) => u.id))

  return allThreats.filter(
    (t) =>
      scopedNodeIds.has(t.node_id) ||
      (t.project_id ? scopedUserIds.has(t.project_id) : false)
  )
}

export function canManageTargetUser(
  session: SessionLike | null | undefined,
  targetUserIdOrEmail: string
): boolean {
  const ctx = ensureSessionUser(session)
  if (!ctx) return false
  if (ctx.role === "Superadmin") return true

  const scoped = getScopedUsers(session)
  return scoped.some(
    (u) =>
      u.id === targetUserIdOrEmail ||
      u.email.toLowerCase() === targetUserIdOrEmail.toLowerCase()
  )
}
