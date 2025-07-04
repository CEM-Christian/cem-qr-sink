import type { OrganizationId } from '../../schemas/organization'
import { getOrganization, getOrganizationLogo, getOrganizationName, ORGANIZATION_LIST, ORGANIZATIONS } from '~/config/organizations'

/**
 * Composable for managing organization data and utilities
 * Provides reactive organization data and helper functions
 */
export function useOrganizations() {
  /**
   * All organization configurations
   */
  const organizations = readonly(ref(ORGANIZATION_LIST))

  /**
   * Organization mapping by ID
   */
  const organizationMap = readonly(ref(ORGANIZATIONS))

  /**
   * Get organization configuration by ID
   */
  const getOrganizationById = (id: OrganizationId | undefined) => {
    if (!id)
      return undefined
    return getOrganization(id)
  }

  /**
   * Get organization display name by ID
   */
  const getOrganizationDisplayName = (id: OrganizationId | undefined) => {
    if (!id)
      return undefined
    return getOrganizationName(id)
  }

  /**
   * Get organization logo URL by ID
   */
  const getOrganizationLogoUrl = (id: OrganizationId | undefined) => {
    if (!id)
      return undefined
    return getOrganizationLogo(id)
  }

  /**
   * Check if an organization ID is valid
   */
  const isValidOrganization = (id: string | undefined): id is OrganizationId => {
    if (!id)
      return false
    return id in ORGANIZATIONS
  }

  /**
   * Get organization options for form selects
   */
  const getOrganizationOptions = () => {
    return ORGANIZATION_LIST.map(org => ({
      label: org.name,
      value: org.id,
      logo: org.logo,
      color: org.color,
    }))
  }

  /**
   * Check if an organization ID is ACC-related
   */
  const isAccOrganization = (id: OrganizationId): boolean => {
    return id === 'acc' || id.startsWith('acc-')
  }

  /**
   * Get all ACC organization IDs (parent + children)
   */
  const getAccOrganizations = (): OrganizationId[] => {
    return ORGANIZATION_LIST
      .map(org => org.id)
      .filter(id => isAccOrganization(id))
  }

  /**
   * Get filtered organizations based on hierarchical selection
   * When 'acc' is selected, returns all ACC organizations
   * Otherwise returns the specific organization or all organizations
   */
  const getFilteredOrganizations = (selectedId: OrganizationId | 'all'): OrganizationId[] => {
    if (selectedId === 'all') {
      return ORGANIZATION_LIST.map(org => org.id)
    }
    if (selectedId === 'acc') {
      return getAccOrganizations()
    }
    return [selectedId]
  }

  return {
    organizations,
    organizationMap,
    getOrganizationById,
    getOrganizationDisplayName,
    getOrganizationLogoUrl,
    isValidOrganization,
    getOrganizationOptions,
    isAccOrganization,
    getAccOrganizations,
    getFilteredOrganizations,
  }
}
